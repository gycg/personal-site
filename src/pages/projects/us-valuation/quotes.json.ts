import { usValuations } from '../../../data/us-valuations';

export const prerender = true;

type QuoteResult = {
  symbol: string;
  price: number;
  source: string;
  updatedAt: string;
};

function fallbackQuote(item: (typeof usValuations)[number]): QuoteResult {
  return {
    symbol: item.symbol,
    price: item.fallbackPrice,
    source: '录入价',
    updatedAt: item.updatedAt,
  };
}

async function fetchStooqQuote(symbol: string, stooqSymbol: string): Promise<QuoteResult | null> {
  const url = `https://stooq.com/q/l/?s=${stooqSymbol}&f=sd2t2ohlcv&h&e=csv`;
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${url}&_=${Date.now()}-${attempt}`, {
        signal: controller.signal,
        headers: {
          'user-agent': 'Mozilla/5.0 personal-blog valuation quote fetcher',
          accept: 'text/csv,text/plain,*/*;q=0.8',
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
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  console.warn(`Stooq quote fetch failed for ${symbol}; using fallback price.`, lastError);
  return null;
}

export async function GET() {
  const quotes = [];

  for (const item of usValuations) {
    const stooqSymbol = item.stooqSymbol ?? `${item.symbol.toLowerCase()}.us`;
    const quote = await fetchStooqQuote(item.symbol, stooqSymbol);
    quotes.push(quote ?? fallbackQuote(item));
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
