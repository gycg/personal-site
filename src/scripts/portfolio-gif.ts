import { GIFEncoder, applyPalette, quantize } from 'gifenc';

type IntradayPoint = {
  date: string;
  time: string;
  open: number;
  close: number;
  high: number;
  low: number;
  amount: number;
  average: number;
};

type PortfolioGifData = {
  name: string;
  positionCount: number;
  source: string;
  previousClose: number;
  rows: IntradayPoint[];
};

declare global {
  interface Window {
    portfolioGifData?: PortfolioGifData;
  }
}

const WIDTH = 960;
const HEIGHT = 600;
const COLORS = {
  background: '#f4f3ec',
  surface: '#fbfbf7',
  text: '#17251d',
  muted: '#66736b',
  grid: '#d9ded7',
  up: '#24754a',
  down: '#aa493b',
  average: '#c98518',
  previous: '#88958d',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

function setFont(context: CanvasRenderingContext2D, size: number, weight = 400, family = 'sans-serif') {
  context.font = `${weight} ${size}px "Noto Sans SC", "Microsoft YaHei", ${family}`;
}

function drawFrame(context: CanvasRenderingContext2D, data: PortfolioGifData, endIndex: number) {
  const rows = data.rows;
  const visibleRows = rows.slice(0, endIndex + 1);
  const latest = visibleRows.at(-1)!;
  const changeAmount = latest.close - data.previousClose;
  const changeRate = changeAmount / data.previousClose;
  const sessionHigh = Math.max(...visibleRows.map((point) => point.high));
  const sessionLow = Math.min(...visibleRows.map((point) => point.low));
  const sessionAmount = visibleRows.reduce((sum, point) => sum + point.amount, 0);
  const priceLeft = 108;
  const priceRight = 908;
  const priceTop = 216;
  const priceBottom = 448;
  const amountTop = 474;
  const amountBottom = 532;
  const rawMin = Math.min(data.previousClose, ...rows.map((point) => point.low));
  const rawMax = Math.max(data.previousClose, ...rows.map((point) => point.high));
  const padding = Math.max((rawMax - rawMin) * 0.08, data.previousClose * 0.002);
  const minPrice = rawMin - padding;
  const maxPrice = rawMax + padding;
  const maxAmount = Math.max(...rows.map((point) => point.amount), 1);
  const xAt = (index: number) => priceLeft + (index / Math.max(rows.length - 1, 1)) * (priceRight - priceLeft);
  const yAt = (value: number) => priceBottom - ((value - minPrice) / (maxPrice - minPrice)) * (priceBottom - priceTop);
  const candleWidth = Math.max(1.2, Math.min(3.4, ((priceRight - priceLeft) / rows.length) * 0.7));

  context.fillStyle = COLORS.background;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = COLORS.surface;
  context.fillRect(24, 20, WIDTH - 48, HEIGHT - 40);
  context.strokeStyle = '#cbd2ca';
  context.lineWidth = 1;
  context.strokeRect(24.5, 20.5, WIDTH - 49, HEIGHT - 41);

  context.fillStyle = COLORS.muted;
  setFont(context, 12, 700);
  context.fillText('PORTFOLIO INTRADAY', 52, 48);
  context.textAlign = 'right';
  context.fillText(`${latest.date}  ${latest.time}`, 908, 48);
  context.textAlign = 'left';

  context.fillStyle = COLORS.text;
  setFont(context, 25, 700, 'serif');
  context.fillText(data.name || '持仓组合', 52, 82);
  context.fillStyle = COLORS.muted;
  setFont(context, 12, 600);
  context.fillText(`${data.positionCount} 只当前持仓 · 全部标的已汇总`, 180, 80);
  context.fillStyle = COLORS.text;
  setFont(context, 25, 700, 'monospace');
  context.fillText(formatCurrency(latest.close), 52, 118);
  context.fillStyle = changeAmount >= 0 ? COLORS.up : COLORS.down;
  setFont(context, 15, 700, 'monospace');
  context.fillText(`${changeAmount >= 0 ? '+' : ''}${formatCurrency(changeAmount)}  ${changeRate >= 0 ? '+' : ''}${(changeRate * 100).toFixed(2)}%`, 310, 116);

  context.strokeStyle = COLORS.grid;
  context.beginPath();
  context.moveTo(52, 132.5);
  context.lineTo(908, 132.5);
  context.stroke();
  const metrics = [
    ['开盘市值', formatCurrency(rows[0].open)],
    ['最高市值', formatCurrency(sessionHigh)],
    ['最低市值', formatCurrency(sessionLow)],
    ['组合前收', formatCurrency(data.previousClose)],
    ['累计成交额', formatCurrency(sessionAmount)],
  ];
  const metricWidth = (908 - 52) / metrics.length;
  metrics.forEach(([label, value], index) => {
    const x = 52 + index * metricWidth;
    context.fillStyle = COLORS.muted;
    setFont(context, 11, 500);
    context.fillText(label, x, 153);
    context.fillStyle = COLORS.text;
    setFont(context, 14, 700, 'monospace');
    context.fillText(value, x, 176);
  });

  context.fillStyle = COLORS.up;
  context.fillRect(priceLeft, 193, 14, 2);
  context.fillStyle = COLORS.muted;
  setFont(context, 10, 500);
  context.fillText('分钟 K', priceLeft + 20, 197);
  context.fillStyle = COLORS.average;
  context.fillRect(priceLeft + 78, 193, 14, 2);
  context.fillStyle = COLORS.muted;
  context.fillText('持仓均价', priceLeft + 98, 197);
  context.fillStyle = COLORS.previous;
  context.fillRect(priceLeft + 174, 193, 14, 2);
  context.fillStyle = COLORS.muted;
  context.fillText('前收', priceLeft + 194, 197);
  context.globalAlpha = 0.4;
  context.fillStyle = COLORS.up;
  context.fillRect(priceLeft + 236, 188, 8, 8);
  context.globalAlpha = 1;
  context.fillStyle = COLORS.muted;
  context.fillText('成交额', priceLeft + 250, 197);

  context.strokeStyle = COLORS.grid;
  context.fillStyle = COLORS.muted;
  setFont(context, 11, 400, 'monospace');
  for (let index = 0; index < 5; index += 1) {
    const ratio = index / 4;
    const y = priceTop + ratio * (priceBottom - priceTop);
    context.beginPath();
    context.moveTo(priceLeft, y + 0.5);
    context.lineTo(priceRight, y + 0.5);
    context.stroke();
    context.textAlign = 'right';
    context.fillText(formatCompact(maxPrice - ratio * (maxPrice - minPrice)), priceLeft - 12, y + 4);
  }

  const previousY = yAt(data.previousClose);
  context.save();
  context.strokeStyle = COLORS.previous;
  context.setLineDash([5, 5]);
  context.beginPath();
  context.moveTo(priceLeft, previousY);
  context.lineTo(priceRight, previousY);
  context.stroke();
  context.restore();

  context.strokeStyle = COLORS.average;
  context.lineWidth = 1.5;
  context.beginPath();
  visibleRows.forEach((point, index) => {
    const x = xAt(index);
    const y = yAt(point.average);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();

  visibleRows.forEach((point, index) => {
    const x = xAt(index);
    const color = point.close >= point.open ? COLORS.up : COLORS.down;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x, yAt(point.high));
    context.lineTo(x, yAt(point.low));
    context.stroke();
    const bodyTop = Math.min(yAt(point.open), yAt(point.close));
    const bodyHeight = Math.max(Math.abs(yAt(point.open) - yAt(point.close)), 1);
    context.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    const amountHeight = (point.amount / maxAmount) * (amountBottom - amountTop);
    context.globalAlpha = 0.34;
    context.fillRect(x - candleWidth / 2, amountBottom - amountHeight, candleWidth, Math.max(amountHeight, 1));
    context.globalAlpha = 1;
  });

  context.fillStyle = COLORS.muted;
  setFont(context, 11, 400, 'monospace');
  const timeLabels = ['09:30', '10:30', '11:30', '14:00', '15:00'];
  for (const time of timeLabels) {
    const index = rows.findIndex((point) => point.time === time);
    if (index < 0) continue;
    context.textAlign = time === timeLabels[0] ? 'left' : time === timeLabels.at(-1) ? 'right' : 'center';
    context.fillText(time, xAt(index), 554);
  }
  context.textAlign = 'left';
  setFont(context, 10, 400);
  context.fillStyle = COLORS.muted;
  context.fillText(`数据源：${data.source} · 行情可能延迟`, 52, 572);
  context.textAlign = 'right';
  context.fillText('cphxnotes.com', 908, 572);
}

async function downloadPortfolioGif(button: HTMLButtonElement) {
  const data = window.portfolioGifData;
  const label = button.querySelector<HTMLElement>('[data-intraday-download-label]');
  if (!data?.rows.length || !label) return;

  button.disabled = true;
  const originalLabel = label.textContent || '下载 GIF';
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return;

  try {
    const gif = GIFEncoder();
    const frameCount = Math.min(64, data.rows.length);
    const frameIndexes = Array.from({ length: frameCount }, (_, index) => (
      Math.round((index / Math.max(frameCount - 1, 1)) * (data.rows.length - 1))
    ));

    for (let frame = 0; frame < frameIndexes.length; frame += 1) {
      drawFrame(context, data, frameIndexes[frame]);
      const rgba = context.getImageData(0, 0, WIDTH, HEIGHT).data;
      const palette = quantize(rgba, 64, { format: 'rgb444' });
      const indexed = applyPalette(rgba, palette, 'rgb444');
      gif.writeFrame(indexed, WIDTH, HEIGHT, {
        palette,
        delay: frame === frameIndexes.length - 1 ? 3000 : 160,
        repeat: 0,
      });
      label.textContent = `生成 ${Math.round(((frame + 1) / frameIndexes.length) * 100)}%`;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }

    gif.finish();
    const blob = new Blob([gif.bytes()], { type: 'image/gif' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `持仓组合分钟行情_${data.rows.at(-1)?.date ?? 'latest'}.gif`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    label.textContent = '已下载';
  } catch (error) {
    console.error('Portfolio GIF export failed', error);
    label.textContent = '生成失败';
  } finally {
    window.setTimeout(() => {
      label.textContent = originalLabel;
      button.disabled = false;
    }, 1600);
  }
}

const downloadButton = document.querySelector<HTMLButtonElement>('[data-intraday-download]');
downloadButton?.addEventListener('click', () => downloadPortfolioGif(downloadButton));
