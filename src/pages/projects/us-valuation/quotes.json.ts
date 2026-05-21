import { usValuations } from '../../../data/us-valuations';

export const prerender = true;

type QuoteResult = {
  symbol: string;
  price: number;
  source: string;
  updatedAt: string;
};

async function fetchStooqQuote(symbol: string, stooqSymbol: string): Promise<QuoteResult | null> {
  const url = `https://stooq.com/q/l/?s=${stooqSymbol}&f=sd2t2ohlcv&h&e=csv`;
  const response = await fetch(`${url}&_=${Date.now()}`, {
    headers: {
      'user-agent': 'Mozilla/5.0 personal-blog valuation quote fetcher',
    },
  });

  if (!response.ok) return null;

  const rows = (await response.text()).trim().split('\n');
  const cells = rows[1]?.split(',') ?? [];
  const price = Number(cells[6]);
  if (!Number.isFinite(price) || price <= 0) return null;

  const date = cells[1];
  const time = cells[2];
  return {
    symbol,
    price,
    source: 'Stooq',
    updatedAt: date && time ? `${date} ${time}` : new Date().toISOString(),
  };
}

export async function GET() {
  const quotes = [];

  for (const item of usValuations) {
    const stooqSymbol = item.stooqSymbol ?? `${item.symbol.toLowerCase()}.us`;
    const quote = await fetchStooqQuote(item.symbol, stooqSymbol);
    quotes.push(quote ?? {
      symbol: item.symbol,
      price: item.fallbackPrice,
      source: '录入价',
      updatedAt: item.updatedAt,
    });
  }

  return new Response(JSON.stringify({
    generatedAt: new Date().toISOString(),
    quotes,
  }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
