import { describe, expect, it } from 'vitest';
import {
  calculateDailyPortfolioPoints,
  calculateLedgerPositions,
  inferSplitEvents,
  summarizePortfolio,
  type LedgerTrade,
} from './portfolio';

const security = { id: 'fund', code: '000001', market: 'sh' as const };
const symbol = () => 'sh000001';

function trade(overrides: Partial<LedgerTrade>): LedgerTrade {
  return {
    executedAt: '2026-01-01 09:30:00',
    securityId: 'fund',
    price: 10,
    quantity: 100,
    amount: 1000,
    fee: 5,
    side: '买入',
    ...overrides,
  };
}

describe('portfolio ledger', () => {
  it('calculates average-cost sales and realized profit', () => {
    const trades = [
      trade({}),
      trade({ executedAt: '2026-01-02 09:30:00', price: 12, quantity: 100, amount: 1200 }),
      trade({ executedAt: '2026-01-03 09:30:00', price: 13, quantity: 50, amount: 650, side: '卖出', tax: 0.5 }),
    ];
    const [position] = calculateLedgerPositions([security], trades, symbol);

    expect(position.quantity).toBe(150);
    expect(position.cost).toBeCloseTo(1657.5);
    expect(position.realizedProfit).toBeCloseTo(92);
    expect(summarizePortfolio([position], trades).totalFees).toBeCloseTo(15.5);
  });

  it('uses explicit bonus shares when no inferred split exists', () => {
    const trades = [trade({}), trade({ executedAt: '2026-01-02 09:30:00', price: 0, quantity: 200, amount: 0, fee: 0, side: '红股入账' })];
    const [position] = calculateLedgerPositions([security], trades, symbol);
    expect(position.quantity).toBe(300);
    expect(position.cost).toBe(1005);
  });

  it('applies an inferred split once and does not double-count its bonus-share record', () => {
    const trades = [
      trade({}),
      trade({ executedAt: '2026-01-02 09:30:00', price: 0, quantity: 200, amount: 0, fee: 0, side: '红股入账' }),
      trade({ executedAt: '2026-01-03 09:30:00', price: 4, quantity: 50, amount: 200 }),
      trade({ executedAt: '2026-01-04 09:30:00', price: 0, quantity: 10, amount: 0, fee: 0, side: '红股入账' }),
    ];
    const [position] = calculateLedgerPositions(
      [security],
      trades,
      symbol,
      [{ securityId: 'fund', date: '2026-01-02', ratio: 3 }],
    );

    expect(position.quantity).toBe(360);
    expect(position.cost).toBe(1210);
  });

  it('infers integer split ratios from raw and adjusted closes', () => {
    const events = inferSplitEvents([{
      securityId: 'fund',
      symbol: 'sh000001',
      rows: [{ date: '2026-01-01', close: 3 }, { date: '2026-01-02', close: 1.01 }],
      qfqRows: [{ date: '2026-01-01', close: 1 }, { date: '2026-01-02', close: 1.01 }],
    }]);
    expect(events).toEqual([{ securityId: 'fund', date: '2026-01-02', ratio: 3 }]);
  });

  it('replays split-adjusted quantities in daily performance', () => {
    const trades = [trade({})];
    const points = calculateDailyPortfolioPoints(
      [security],
      trades,
      symbol,
      [{
        securityId: 'fund',
        symbol: 'sh000001',
        rows: [{ date: '2026-01-01', close: 10 }, { date: '2026-01-02', close: 4 }],
      }],
      [{ securityId: 'fund', date: '2026-01-02', ratio: 3 }],
    );
    expect(points[0].marketValue).toBe(1000);
    expect(points[1].marketValue).toBe(1200);
    expect(points[1].profit).toBe(195);
  });
});
