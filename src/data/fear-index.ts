import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';

export type FearPoint = {
  date: string;
  fear: number | null;
  index: number | null;
  parts?: {
    iv300?: number | null;
    ivMidSmall?: number | null;
    pcr?: number | null;
    basis?: number | null;
  };
};

export type FearIndexData = {
  updatedAt: string;
  us: FearPoint[];
  cn: FearPoint[];
  latestUs: FearPoint | null;
  latestCn: FearPoint | null;
};

type NumericPoint = {
  date: string;
  value: number;
};

type KlinePoint = {
  date: string;
  close: number;
};

const FIVE_YEAR_DAYS = 252 * 5;
const CACHE_TTL_MS = 1000 * 60 * 60 * 4;
const CACHE_PATH = join(process.cwd(), '.astro', 'fear-index-cache.json');
const execFileAsync = promisify(execFile);
let memoryCache: { savedAt: number; data: FearIndexData } | null = null;

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function compactDate(date: string) {
  return date.replaceAll('-', '');
}

function parseNumber(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const normalized = value.replaceAll(',', '').trim();
  if (!normalized || normalized === '.' || normalized === '#NAME?') return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchText(url: string, timeoutMs = 12000) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}-${attempt}`, {
        signal: controller.signal,
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Safari/537.36',
          accept: 'application/json,text/csv,text/plain,*/*;q=0.8',
          referer: 'https://www.sse.com.cn/',
        },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const text = await response.text();
      if (!text.trim()) throw new Error('empty response');
      return text;
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('request failed');
}

function percentileSeries(points: NumericPoint[], windowSize: number, highIsPanic = true) {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const values: number[] = [];
  const result = new Map<string, number>();

  for (const point of sorted) {
    values.push(point.value);
    const windowValues = values.slice(-windowSize).filter(Number.isFinite);
    const latest = windowValues.at(-1);
    if (!windowValues.length || latest === undefined) continue;

    const rank = windowValues.filter((value) => value <= latest).length / windowValues.length;
    result.set(point.date, highIsPanic ? rank * 100 : (1 - rank) * 100);
  }

  return result;
}

function parseFredCsv(text: string, column: string): NumericPoint[] {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, raw] = line.split(',');
      const value = parseNumber(raw);
      return value === null ? null : { date, value };
    })
    .filter((point): point is NumericPoint => Boolean(point));
}

async function fetchFredSeries(id: 'VIXCLS' | 'SP500') {
  const text = await fetchText(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`);
  return parseFredCsv(text, id);
}

function parseOptbbsCsv(text: string) {
  const rows = text.trim().split(/\r?\n/);

  return rows
    .slice(1)
    .map((line) => {
      const columns = line.split(',');
      const rawDate = columns[0];
      if (!rawDate) return null;

      const [year, month, day] = rawDate.split('/');
      const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const iv300 = parseNumber(columns[12]);
      const iv500 = parseNumber(columns[70]);
      const iv1000 = parseNumber(columns[86]);
      const ivMidSmall = iv1000 ?? iv500;

      if (iv300 === null && ivMidSmall === null) return null;
      return { date, iv300, ivMidSmall };
    })
    .filter((point): point is { date: string; iv300: number | null; ivMidSmall: number | null } => Boolean(point));
}

async function fetchOptbbsIvSeries() {
  const text = await fetchText('http://1.optbbs.com/d/csv/d/k.csv', 16000);
  return parseOptbbsCsv(text);
}

function parseTencentKlines(payload: any, symbol: string): KlinePoint[] {
  const rows = payload.data?.[symbol]?.qfqday ?? payload.data?.[symbol]?.day ?? [];

  return rows
    .map((row: string[]) => ({
      date: row[0],
      close: Number(row[2]),
    }))
    .filter((point: KlinePoint) => point.date && Number.isFinite(point.close));
}

async function fetchTencentKlines(symbol: string, start: string) {
  const url = `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${symbol},day,${start},2050-01-01,1600,qfq`;
  return parseTencentKlines(JSON.parse(await fetchText(url)), symbol);
}

function parseSinaFuturesDaily(text: string): KlinePoint[] {
  const match = text.match(/\((\[.*\])\);?$/s);
  if (!match) return [];

  return JSON.parse(match[1])
    .map((row: any) => ({
      date: row.d,
      close: Number(row.c),
    }))
    .filter((point: KlinePoint) => point.date && Number.isFinite(point.close));
}

async function fetchIfMainFuture() {
  const text = await fetchText(
    'https://stock2.finance.sina.com.cn/futures/api/jsonp.php/var%20_IF0=/InnerFuturesNewService.getDailyKLine?symbol=IF0&type=2021_04_12',
  );
  return parseSinaFuturesDaily(text);
}

async function fetchSsePcrForDate(date: string) {
  const url = `http://query.sse.com.cn/commonQuery.do?isPagination=false&sqlId=COMMON_SSE_ZQPZ_YSP_QQ_SJTJ_MRTJ_CX&tradeDate=${compactDate(date)}`;
  const payload = JSON.parse(await fetchSseText(url));
  const rows = Array.isArray(payload.result) ? payload.result : [];
  let putVolume = 0;
  let callVolume = 0;

  for (const row of rows) {
    const code = String(row.SECURITY_CODE ?? '');
    if (!['510300', '510500', '510050'].includes(code)) continue;

    putVolume += parseNumber(row.PUT_VOLUME) ?? 0;
    callVolume += parseNumber(row.CALL_VOLUME) ?? 0;
  }

  return callVolume > 0 ? { date, value: putVolume / callVolume } : null;
}

async function fetchSseText(url: string) {
  try {
    const text = await fetchText(url, 8000);
    if (!text.trim().startsWith('{')) throw new Error('SSE returned non-JSON response');
    return text;
  } catch {
    const { stdout } = await execFileAsync(
      'curl',
      ['-L', '-s', '--max-time', '8', url, '-H', 'Referer: https://www.sse.com.cn/', '-H', 'User-Agent: Mozilla/5.0'],
      { maxBuffer: 1024 * 1024 },
    );
    if (!stdout.trim() || stdout.trim().startsWith('<')) throw new Error('SSE request failed');
    return stdout;
  }
}

async function fetchSsePcrSeries(dates: string[]) {
  const result: NumericPoint[] = [];
  const queue = [...dates];
  const workerCount = 18;

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (queue.length) {
        const date = queue.shift();
        if (!date) continue;
        const point = await fetchSsePcrForDate(date).catch(() => null);
        if (point) result.push(point);
      }
    }),
  );

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

function byDate(points: NumericPoint[] | KlinePoint[]) {
  return new Map(points.map((point: any) => [point.date, point.value ?? point.close]));
}

function latest<T>(items: T[]) {
  return items.length ? items[items.length - 1] : null;
}

async function readCache() {
  if (memoryCache && Date.now() - memoryCache.savedAt < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  try {
    const cached = JSON.parse(await readFile(CACHE_PATH, 'utf-8')) as { savedAt: number; data: FearIndexData };
    if (Date.now() - cached.savedAt < CACHE_TTL_MS) {
      memoryCache = cached;
      return cached.data;
    }
  } catch {
    return null;
  }

  return null;
}

async function writeCache(data: FearIndexData) {
  const payload = { savedAt: Date.now(), data };
  memoryCache = payload;
  await mkdir(dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(payload), 'utf-8');
}

async function fetchFearIndexData(): Promise<FearIndexData> {
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(start.getFullYear() - 6);
  const oneYearStart = new Date(now);
  oneYearStart.setFullYear(oneYearStart.getFullYear() - 1);
  const tencentStart = formatDate(start);

  const [vix, sp500, hs300, optbbs, ifFuture] = await Promise.all([
    fetchFredSeries('VIXCLS').catch(() => []),
    fetchFredSeries('SP500').catch(() => []),
    fetchTencentKlines('sh000300', tencentStart).catch(() => []),
    fetchOptbbsIvSeries().catch(() => []),
    fetchIfMainFuture().catch(() => []),
  ]);

  const sp500ByDate = byDate(sp500);
  const hs300ByDate = byDate(hs300);
  const hs300CloseByDate = byDate(hs300);
  const ifByDate = byDate(ifFuture);
  const vixFearByDate = percentileSeries(vix, FIVE_YEAR_DAYS, true);

  const us = vix
    .filter((point) => point.date >= formatDate(oneYearStart))
    .map((point) => ({
      date: point.date,
      fear: vixFearByDate.get(point.date) ?? null,
      index: sp500ByDate.get(point.date) ?? null,
    }));

  const iv300Points: NumericPoint[] = optbbs
    .filter((point) => point.iv300 !== null)
    .map((point) => ({ date: point.date, value: point.iv300! }));
  const ivMidSmallPoints: NumericPoint[] = optbbs
    .filter((point) => point.ivMidSmall !== null)
    .map((point) => ({ date: point.date, value: point.ivMidSmall! }));

  const basisPoints: NumericPoint[] = ifFuture
    .map((point) => {
      const hs300Close = hs300CloseByDate.get(point.date);
      if (!hs300Close) return null;
      return { date: point.date, value: point.close / hs300Close - 1 };
    })
    .filter((point): point is NumericPoint => Boolean(point));

  const ivDates = optbbs.map((point) => point.date).filter((date) => date >= formatDate(oneYearStart));
  const pcrPoints = await fetchSsePcrSeries(ivDates);

  const iv300Rank = percentileSeries(iv300Points, FIVE_YEAR_DAYS, true);
  const ivMidSmallRank = percentileSeries(ivMidSmallPoints, FIVE_YEAR_DAYS, true);
  const pcrRank = percentileSeries(pcrPoints, FIVE_YEAR_DAYS, true);
  const basisRank = percentileSeries(basisPoints, FIVE_YEAR_DAYS, false);

  const cn = optbbs
    .filter((point) => point.date >= formatDate(oneYearStart))
    .map((point) => {
      const iv300 = iv300Rank.get(point.date) ?? null;
      const ivMidSmall = ivMidSmallRank.get(point.date) ?? null;
      const pcr = pcrRank.get(point.date) ?? null;
      const basis = basisRank.get(point.date) ?? null;
      const weighted = [
        [iv300, 0.4],
        [ivMidSmall, 0.25],
        [pcr, 0.2],
        [basis, 0.15],
      ] as const;
      const availableWeight = weighted.reduce((sum, [value, weight]) => sum + (value === null ? 0 : weight), 0);
      const fear =
        availableWeight > 0
          ? weighted.reduce((sum, [value, weight]) => sum + (value === null ? 0 : value * weight), 0) / availableWeight
          : null;

      return {
        date: point.date,
        fear,
        index: hs300ByDate.get(point.date) ?? null,
        parts: { iv300, ivMidSmall, pcr, basis },
      };
    });

  return {
    updatedAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }),
    us,
    cn,
    latestUs: latest(us),
    latestCn: latest(cn),
  };
}

export async function getFearIndexData(): Promise<FearIndexData> {
  const cached = await readCache();
  if (cached) return cached;

  const data = await fetchFearIndexData();
  await writeCache(data).catch(() => undefined);
  return data;
}
