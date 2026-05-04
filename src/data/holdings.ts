export type Security = {
  id: string;
  name: string;
  code: string;
  market: 'sh' | 'sz';
  note: string;
};

export type Trade = {
  executedAt: string;
  securityId: string;
  price: number;
  quantity: number;
  amount: number;
  fee: number;
  side: '买入' | '卖出';
};

export type TargetAllocation = {
  category: string;
  market: 'sh' | 'sz';
  code: string;
  name: string;
  amount: number | null;
  weight: number | null;
  feeRate: string;
};

export const securities: Security[] = [
  {
    id: 'ai-intelligence',
    name: 'AI智能',
    code: '159819',
    market: 'sz',
    note: '易方达中证人工智能主题 ETF',
  },
  {
    id: 'power-grid-etf',
    name: '电网ETF',
    code: '159320',
    market: 'sz',
    note: '广发恒生 A 股电网设备 ETF',
  },
  {
    id: 'innovative-medicine',
    name: '创新医药',
    code: '516080',
    market: 'sh',
    note: '易方达中证创新药产业 ETF',
  },
];

export const trades: Trade[] = [
  {
    executedAt: '2026-04-21 14:24:27',
    securityId: 'ai-intelligence',
    price: 1.716,
    quantity: 3000,
    amount: 5148.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-04-21 14:24:14',
    securityId: 'power-grid-etf',
    price: 2.126,
    quantity: 2300,
    amount: 4889.8,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-04-17 13:55:44',
    securityId: 'innovative-medicine',
    price: 0.673,
    quantity: 7500,
    amount: 5047.5,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-04-16 10:13:47',
    securityId: 'power-grid-etf',
    price: 2.038,
    quantity: 2400,
    amount: 4891.2,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-04-16 10:13:35',
    securityId: 'ai-intelligence',
    price: 1.662,
    quantity: 3000,
    amount: 4986.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-04-16 10:13:23',
    securityId: 'innovative-medicine',
    price: 0.685,
    quantity: 7200,
    amount: 4932.0,
    fee: 5.0,
    side: '买入',
  },
];

export const targetAllocations: TargetAllocation[] = [
  {
    category: '中国大盘股',
    market: 'sh',
    code: '510300',
    name: '沪深300ETF华泰柏瑞',
    amount: 120000,
    weight: 0.12,
    feeRate: '0.15% + 0.05%',
  },
  {
    category: '中国中盘股',
    market: 'sh',
    code: '510500',
    name: '中证500ETF南方',
    amount: 50000,
    weight: 0.05,
    feeRate: '0.15% + 0.05%',
  },
  {
    category: '中国小盘股',
    market: 'sh',
    code: '512100',
    name: '中证1000ETF南方',
    amount: 30000,
    weight: 0.03,
    feeRate: '0.15% + 0.05%',
  },
  {
    category: '美国宽基',
    market: 'sh',
    code: '513500',
    name: '标普500ETF博时',
    amount: 300000,
    weight: 0.3,
    feeRate: '0.60% + 0.20%',
  },
  {
    category: '美国宽基',
    market: 'sh',
    code: '513650',
    name: '标普500ETF南方',
    amount: null,
    weight: null,
    feeRate: '0.60% + 0.15%',
  },
  {
    category: '美国科技成长',
    market: 'sh',
    code: '513100',
    name: '纳指ETF国泰',
    amount: 150000,
    weight: 0.15,
    feeRate: '0.60% + 0.20%',
  },
  {
    category: '美国科技成长',
    market: 'sz',
    code: '159501',
    name: '纳指ETF嘉实',
    amount: null,
    weight: null,
    feeRate: '0.50% + 0.10%',
  },
  {
    category: '黄金',
    market: 'sh',
    code: '518880',
    name: '华安黄金ETF',
    amount: 100000,
    weight: 0.1,
    feeRate: '0.50% + 0.10%',
  },
  {
    category: '沙特股票',
    market: 'sh',
    code: '520830',
    name: '沙特ETF华泰柏瑞',
    amount: 25000,
    weight: 0.025,
    feeRate: '0.50% + 0.10%',
  },
  {
    category: '中国债券',
    market: 'sz',
    code: '161119',
    name: '易方达中债新综指LOF A',
    amount: 225000,
    weight: 0.225,
    feeRate: '0.15% + 0.05%',
  },
];

export function getSecurityById(id: string) {
  return securities.find((security) => security.id === id);
}

export function getQuoteSymbol(security: Security) {
  return `${security.market}${security.code}`;
}

export function getEastmoneySecid(security: Security) {
  const marketPrefix = security.market === 'sh' ? '1' : '0';
  return `${marketPrefix}.${security.code}`;
}

export function calculatePositions() {
  const positions = securities.map((security) => ({
    ...security,
    quoteSymbol: getQuoteSymbol(security),
    quantity: 0,
    cost: 0,
    fees: 0,
    buyAmount: 0,
    sellAmount: 0,
    realizedProfit: 0,
    lastTradePrice: 0,
  }));

  const positionById = new Map(positions.map((position) => [position.id, position]));
  const chronologicalTrades = [...trades].sort((a, b) => a.executedAt.localeCompare(b.executedAt));

  for (const trade of chronologicalTrades) {
    const position = positionById.get(trade.securityId);
    if (!position) continue;

    position.fees += trade.fee;
    position.lastTradePrice = trade.price;

    if (trade.side === '买入') {
      position.quantity += trade.quantity;
      position.cost += trade.amount + trade.fee;
      position.buyAmount += trade.amount + trade.fee;
      continue;
    }

    const averageCost = position.quantity > 0 ? position.cost / position.quantity : 0;
    const closingCost = averageCost * trade.quantity;
    const proceeds = trade.amount - trade.fee;

    position.quantity -= trade.quantity;
    position.cost -= closingCost;
    position.sellAmount += proceeds;
    position.realizedProfit += proceeds - closingCost;
  }

  return positions.filter((position) => position.quantity !== 0 || position.realizedProfit !== 0);
}

export function calculatePortfolioSummary() {
  const positions = calculatePositions();
  return {
    totalCost: positions.reduce((sum, position) => sum + position.cost, 0),
    totalQuantity: positions.reduce((sum, position) => sum + position.quantity, 0),
    totalFees: trades.reduce((sum, trade) => sum + trade.fee, 0),
    totalBuyAmount: positions.reduce((sum, position) => sum + position.buyAmount, 0),
    realizedProfit: positions.reduce((sum, position) => sum + position.realizedProfit, 0),
  };
}
