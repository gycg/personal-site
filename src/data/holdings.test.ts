import { describe, expect, it } from 'vitest';
import { calculatePortfolioSummary, calculatePositions } from './holdings';

describe('holdings ledger integration', () => {
  it('includes explicit ETF split shares in current quantities', () => {
    const positions = calculatePositions();
    const positionByCode = new Map(positions.map((position) => [position.code, position]));

    expect(positionByCode.get('159320')?.quantity).toBe(28800);
    expect(positionByCode.get('588200')?.quantity).toBe(29300);
  });

  it('keeps split-adjusted shares at zero additional cost', () => {
    const starChip = calculatePositions().find((position) => position.code === '588200');

    expect(starChip?.cost).toBeCloseTo(35134.8);
    expect(starChip?.priceCost).toBeCloseTo(35119.8);
  });

  it('uses all buy cash flows as the cumulative return base', () => {
    const summary = calculatePortfolioSummary();

    expect(summary.totalBuyAmount).toBeGreaterThan(summary.totalCost);
    expect(summary.totalBuyAmount - summary.totalCost).toBeCloseTo(5005);
  });
});
