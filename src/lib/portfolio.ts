export type LedgerSecurity = {
  id: string;
};

export type LedgerTrade = {
  executedAt: string;
  securityId: string;
  price: number;
  quantity: number;
  amount: number;
  fee: number;
  tax?: number;
  side: '买入' | '卖出' | '红股入账' | '现金分红' | '利息归本' | '红利税补缴';
};

export type SplitEvent = {
  securityId: string;
  date: string;
  ratio: number;
};

export type KlineGroup = {
  securityId: string;
  symbol: string;
  rows: Array<{ date: string; close: number }>;
  qfqRows?: Array<{ date: string; close: number }>;
};

export type PortfolioPosition<TSecurity extends LedgerSecurity> = TSecurity & {
  quoteSymbol: string;
  quantity: number;
  cost: number;
  priceCost: number;
  fees: number;
  buyAmount: number;
  sellAmount: number;
  realizedProfit: number;
  lastTradePrice: number;
};

export type DailyPortfolioPoint<TTrade extends LedgerTrade> = {
  date: string;
  marketValue: number;
  cost: number;
  profit: number;
  dailyChange: number;
  trades: TTrade[];
};

const cashEventSides = new Set<LedgerTrade['side']>(['现金分红', '利息归本', '红利税补缴']);

export function getTradeDate(trade: LedgerTrade) {
  return trade.executedAt.slice(0, 10);
}

export function inferSplitEvents(klineGroups: KlineGroup[]): SplitEvent[] {
  const splitEvents: SplitEvent[] = [];
  const normalizeRatio = (ratio: number) => {
    const nearestInteger = Math.round(ratio);
    if (nearestInteger > 1 && Math.abs(ratio - nearestInteger) <= 0.02) return nearestInteger;
    return Math.round(ratio * 10000) / 10000;
  };

  for (const group of klineGroups) {
    if (!group.qfqRows?.length) continue;

    const qfqCloseByDate = new Map(group.qfqRows.map((row) => [row.date, row.close]));
    let previousFactor: number | null = null;

    for (const row of group.rows) {
      const qfqClose = qfqCloseByDate.get(row.date);
      if (!qfqClose || qfqClose <= 0) continue;

      const factor = row.close / qfqClose;
      if (previousFactor && previousFactor / factor >= 1.5) {
        const ratio = normalizeRatio(previousFactor / factor);
        if (ratio > 1) splitEvents.push({ securityId: group.securityId, date: row.date, ratio });
      }
      previousFactor = factor;
    }
  }

  return splitEvents;
}

export function calculateLedgerPositions<TSecurity extends LedgerSecurity, TTrade extends LedgerTrade>(
  securities: TSecurity[],
  trades: TTrade[],
  getQuoteSymbol: (security: TSecurity) => string,
  splitEvents: SplitEvent[] = [],
): Array<PortfolioPosition<TSecurity>> {
  const positions = securities.map((security) => ({
    ...security,
    quoteSymbol: getQuoteSymbol(security),
    quantity: 0,
    cost: 0,
    priceCost: 0,
    fees: 0,
    buyAmount: 0,
    sellAmount: 0,
    realizedProfit: 0,
    lastTradePrice: 0,
  }));
  const positionById = new Map(positions.map((position) => [position.id, position]));
  const eventsBySecurityId = new Map<string, SplitEvent[]>();

  for (const event of splitEvents) {
    const events = eventsBySecurityId.get(event.securityId) ?? [];
    events.push(event);
    eventsBySecurityId.set(event.securityId, events);
  }
  for (const events of eventsBySecurityId.values()) events.sort((a, b) => a.date.localeCompare(b.date));

  const sortedTrades = [...trades].sort((a, b) => a.executedAt.localeCompare(b.executedAt));
  const appliedSplitCount = new Map<string, number>();

  const applyDueSplits = (securityId: string, date: string) => {
    const events = eventsBySecurityId.get(securityId) ?? [];
    const position = positionById.get(securityId);
    if (!position) return;

    let index = appliedSplitCount.get(securityId) ?? 0;
    while (index < events.length && events[index].date <= date) {
      position.quantity *= events[index].ratio;
      index += 1;
    }
    appliedSplitCount.set(securityId, index);
  };

  for (const trade of sortedTrades) {
    const position = positionById.get(trade.securityId);
    if (!position) continue;

    applyDueSplits(trade.securityId, getTradeDate(trade));
    position.fees += trade.fee;
    position.lastTradePrice = trade.price;

    if (trade.side === '买入') {
      position.quantity += trade.quantity;
      position.cost += trade.amount + trade.fee;
      position.priceCost += trade.amount;
      position.buyAmount += trade.amount + trade.fee;
      continue;
    }

    if (trade.side === '红股入账') {
      const duplicatesInferredSplit = (eventsBySecurityId.get(trade.securityId) ?? [])
        .some((event) => event.date === getTradeDate(trade));
      if (!duplicatesInferredSplit) position.quantity += trade.quantity;
      continue;
    }

    if (cashEventSides.has(trade.side)) {
      position.realizedProfit += trade.amount;
      continue;
    }

    const averageCost = position.quantity > 0 ? position.cost / position.quantity : 0;
    const averagePriceCost = position.quantity > 0 ? position.priceCost / position.quantity : 0;
    const closingCost = averageCost * trade.quantity;
    const closingPriceCost = averagePriceCost * trade.quantity;
    const proceeds = trade.amount - trade.fee - (trade.tax ?? 0);

    position.quantity -= trade.quantity;
    position.cost -= closingCost;
    position.priceCost -= closingPriceCost;
    position.sellAmount += proceeds;
    position.realizedProfit += proceeds - closingCost;
  }

  for (const [securityId, events] of eventsBySecurityId) {
    const position = positionById.get(securityId);
    if (!position) continue;
    for (let index = appliedSplitCount.get(securityId) ?? 0; index < events.length; index += 1) {
      position.quantity *= events[index].ratio;
    }
  }

  return positions.filter((position) => position.quantity !== 0 || position.realizedProfit !== 0);
}

export function summarizePortfolio<TSecurity extends LedgerSecurity, TTrade extends LedgerTrade>(
  positions: Array<PortfolioPosition<TSecurity>>,
  trades: TTrade[],
) {
  const activeRealizedProfit = positions
    .filter((position) => position.quantity !== 0)
    .reduce((sum, position) => sum + position.realizedProfit, 0);
  const closedRealizedProfit = positions
    .filter((position) => position.quantity === 0)
    .reduce((sum, position) => sum + position.realizedProfit, 0);

  return {
    totalCost: positions.reduce((sum, position) => sum + position.cost, 0),
    totalQuantity: positions.reduce((sum, position) => sum + position.quantity, 0),
    totalFees: trades.reduce((sum, trade) => sum + trade.fee + (trade.tax ?? 0), 0),
    totalBuyAmount: positions.reduce((sum, position) => sum + position.buyAmount, 0),
    realizedProfit: positions.reduce((sum, position) => sum + position.realizedProfit, 0),
    activeRealizedProfit,
    closedRealizedProfit,
  };
}

export function calculateDailyPortfolioPoints<
  TSecurity extends LedgerSecurity,
  TTrade extends LedgerTrade,
>(
  securities: TSecurity[],
  trades: TTrade[],
  getQuoteSymbol: (security: TSecurity) => string,
  klineGroups: KlineGroup[],
  splitEvents: SplitEvent[],
): Array<DailyPortfolioPoint<TTrade>> {
  const klineBySymbol = new Map(klineGroups.map((group) => [group.symbol, group.rows]));
  const allDates = [...new Set(klineGroups.flatMap((group) => group.rows.map((row) => row.date)))].sort();
  const sortedTrades = [...trades].sort((a, b) => a.executedAt.localeCompare(b.executedAt));
  const stateById = new Map(securities.map((security) => [security.id, { quantity: 0, cost: 0, realizedProfit: 0 }]));
  const splitEventsByDate = new Map<string, SplitEvent[]>();

  for (const event of splitEvents) {
    const events = splitEventsByDate.get(event.date) ?? [];
    events.push(event);
    splitEventsByDate.set(event.date, events);
  }

  const latestCloseBySymbol = new Map<string, number>();
  let tradeIndex = 0;
  let previousProfit: number | null = null;

  return allDates
    .map((date) => {
      for (const [symbol, rows] of klineBySymbol) {
        const row = rows.find((item) => item.date === date);
        if (row) latestCloseBySymbol.set(symbol, row.close);
      }

      for (const event of splitEventsByDate.get(date) ?? []) {
        const state = stateById.get(event.securityId);
        if (state) state.quantity *= event.ratio;
      }

      while (tradeIndex < sortedTrades.length && getTradeDate(sortedTrades[tradeIndex]) <= date) {
        const trade = sortedTrades[tradeIndex];
        const state = stateById.get(trade.securityId);

        if (state) {
          if (trade.side === '买入') {
            state.quantity += trade.quantity;
            state.cost += trade.amount + trade.fee;
          } else if (trade.side === '红股入账') {
            const duplicatesInferredSplit = (splitEventsByDate.get(getTradeDate(trade)) ?? [])
              .some((event) => event.securityId === trade.securityId);
            if (!duplicatesInferredSplit) state.quantity += trade.quantity;
          } else if (cashEventSides.has(trade.side)) {
            state.realizedProfit += trade.amount;
          } else {
            const averageCost = state.quantity > 0 ? state.cost / state.quantity : 0;
            const closingCost = averageCost * trade.quantity;
            state.quantity -= trade.quantity;
            state.cost -= closingCost;
            state.realizedProfit += trade.amount - trade.fee - (trade.tax ?? 0) - closingCost;
          }
        }

        tradeIndex += 1;
      }

      let marketValue = 0;
      let cost = 0;
      let realizedProfit = 0;

      for (const security of securities) {
        const state = stateById.get(security.id);
        const close = latestCloseBySymbol.get(getQuoteSymbol(security));
        if (!state || !close) continue;
        marketValue += state.quantity * close;
        cost += state.cost;
        realizedProfit += state.realizedProfit;
      }

      if (marketValue <= 0 && cost <= 0) return null;
      const profit = marketValue - cost + realizedProfit;
      const dailyChange = previousProfit === null ? 0 : profit - previousProfit;
      previousProfit = profit;
      return { date, marketValue, cost, profit, dailyChange };
    })
    .filter((point): point is Omit<DailyPortfolioPoint<TTrade>, 'trades'> => Boolean(point))
    .map((point) => ({
      ...point,
      trades: sortedTrades.filter((trade) => getTradeDate(trade) === point.date),
    }));
}
