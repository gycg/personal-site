import { calculateLedgerPositions, summarizePortfolio } from '../lib/portfolio';

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
  tax?: number;
  side: '买入' | '卖出' | '红股入账' | '现金分红' | '利息归本' | '红利税补缴';
  note?: string;
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

export type IndustryPlanAllocation = {
  category: string;
  code: string;
  name: string;
  currentAmount: number;
  action: string;
  newCashBuy: number;
  switchedCashBuy: number;
  finalAmount: number;
  finalWeight: number;
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
  {
    id: 'brokerage-etf',
    name: '券商ETF',
    code: '512000',
    market: 'sh',
    note: '华宝中证全指证券公司 ETF',
  },
  {
    id: 'bond-index-lof',
    name: '中债LOF',
    code: '161119',
    market: 'sz',
    note: '易方达中债新综指 LOF A',
  },
  {
    id: 'star-chip-etf',
    name: '科创芯片ETF',
    code: '588200',
    market: 'sh',
    note: '嘉实上证科创板芯片 ETF',
  },
  {
    id: 'communication-etf',
    name: '通信ETF',
    code: '515880',
    market: 'sh',
    note: '国泰中证全指通信设备 ETF',
  },
  {
    id: 'rongda-photosensitive',
    name: '容大感光',
    code: '300576',
    market: 'sz',
    note: '深圳市容大感光科技股份有限公司',
  },
  {
    id: 'csi-300-etf',
    name: '沪深300ETF',
    code: '510300',
    market: 'sh',
    note: '华泰柏瑞沪深300 ETF',
  },
  {
    id: 'csi-500-etf',
    name: '中证500ETF南方',
    code: '510500',
    market: 'sh',
    note: '南方中证500 ETF',
  },
  {
    id: 'csi-1000-etf',
    name: '中证1000ETF南方',
    code: '512100',
    market: 'sh',
    note: '南方中证1000 ETF',
  },
  {
    id: 'dividend-etf',
    name: '红利ETF',
    code: '515080',
    market: 'sh',
    note: '招商中证红利 ETF',
  },
  {
    id: 'robot-etf',
    name: '机器人ETF',
    code: '159530',
    market: 'sz',
    note: '易方达国证机器人产业 ETF',
  },
  {
    id: 'gold-etf',
    name: '黄金ETF',
    code: '518880',
    market: 'sh',
    note: '华安黄金 ETF',
  },
  {
    id: 'sp500-etf',
    name: '标普ETF',
    code: '513650',
    market: 'sh',
    note: '南方标普500 ETF',
  },
];

export const trades: Trade[] = [
  {
    executedAt: '2026-08-20 13:59:21',
    securityId: 'csi-500-etf',
    price: 7.825,
    quantity: 2600,
    amount: 20345,
    fee: 5,
    side: '买入',
  },
  {
    executedAt: '2026-08-03 09:35:00',
    securityId: 'sp500-etf',
    price: 1.907,
    quantity: 15700,
    amount: 29939.9,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-08-03 09:35:00',
    securityId: 'gold-etf',
    price: 8.396,
    quantity: 1100,
    amount: 9235.6,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-31 14:46:08',
    securityId: 'star-chip-etf',
    price: 1.12,
    quantity: 13400,
    amount: 15008.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-21 10:59:53',
    securityId: 'csi-1000-etf',
    price: 2.85,
    quantity: 10500,
    amount: 29925.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-21 09:30:00',
    securityId: 'star-chip-etf',
    price: 0,
    quantity: 10600,
    amount: 0,
    fee: 0,
    side: '红股入账',
    note: '科创芯片ETF 588200 份额拆分，权益登记日 2026-07-20，除权日 2026-07-21，拆分比例 1:3；原 5300 份新增 10600 份，成本金额不变。',
  },
  {
    executedAt: '2026-07-15 13:31:27',
    securityId: 'star-chip-etf',
    price: 4.216,
    quantity: 2400,
    amount: 10118.4,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-14 09:52:52',
    securityId: 'csi-300-etf',
    price: 4.743,
    quantity: 4200,
    amount: 19920.6,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-15 09:30:00',
    securityId: 'power-grid-etf',
    price: 0,
    quantity: 19200,
    amount: 0,
    fee: 0,
    side: '红股入账',
    note: '电网ETF 159320 份额分拆，权益登记日 2026-07-14，除权日 2026-07-15，分拆比例 1:3.0000；原 9600 份新增 19200 份，成本金额不变。',
  },
  {
    executedAt: '2026-07-08 14:32:22',
    securityId: 'robot-etf',
    price: 1.536,
    quantity: 6500,
    amount: 9984.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-08 14:31:45',
    securityId: 'communication-etf',
    price: 0.763,
    quantity: 13100,
    amount: 9995.3,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-07 14:12:06',
    securityId: 'power-grid-etf',
    price: 2.045,
    quantity: 4900,
    amount: 10020.5,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-07 10:18:47',
    securityId: 'dividend-etf',
    price: 1.47,
    quantity: 6800,
    amount: 9996.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-07-06 13:05:14',
    securityId: 'communication-etf',
    price: 0.771,
    quantity: 12900,
    amount: 9945.9,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-30 13:56:35',
    securityId: 'dividend-etf',
    price: 1.404,
    quantity: 7100,
    amount: 9968.4,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-30 13:12:26',
    securityId: 'gold-etf',
    price: 8.291,
    quantity: 2500,
    amount: 20727.5,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-30 13:12:09',
    securityId: 'sp500-etf',
    price: 1.872,
    quantity: 16000,
    amount: 29952.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-30 09:51:47',
    securityId: 'csi-300-etf',
    price: 4.974,
    quantity: 4000,
    amount: 19896.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-23 19:18:55',
    securityId: 'dividend-etf',
    price: 0,
    quantity: 0,
    amount: 374.0,
    fee: 0,
    side: '现金分红',
  },
  {
    executedAt: '2026-06-22 11:32:48',
    securityId: 'rongda-photosensitive',
    price: 0,
    quantity: 0,
    amount: 23.51,
    fee: 0,
    side: '利息归本',
  },
  {
    executedAt: '2026-06-22 11:32:49',
    securityId: 'rongda-photosensitive',
    price: 0,
    quantity: 0,
    amount: -1.4,
    fee: 0,
    side: '红利税补缴',
  },
  {
    executedAt: '2026-06-22 09:30:00',
    securityId: 'robot-etf',
    price: 1.645,
    quantity: 6100,
    amount: 10034.5,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-18 09:30:17',
    securityId: 'rongda-photosensitive',
    price: 51.21,
    quantity: 110,
    amount: 5633.1,
    fee: 5.0,
    tax: 2.82,
    side: '卖出',
    note: '卖出成交价由用户补充；印花税 2.82 元按成交金额约 0.05% 计。',
  },
  {
    executedAt: '2026-06-15 09:25:01',
    securityId: 'dividend-etf',
    price: 1.592,
    quantity: 12500,
    amount: 19900.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-12 09:53:07',
    securityId: 'csi-300-etf',
    price: 4.806,
    quantity: 4200,
    amount: 20185.2,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-09 19:33:17',
    securityId: 'rongda-photosensitive',
    price: 0,
    quantity: 10,
    amount: 0,
    fee: 0,
    side: '红股入账',
  },
  {
    executedAt: '2026-06-03 09:25:01',
    securityId: 'dividend-etf',
    price: 1.596,
    quantity: 6200,
    amount: 9895.2,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-03 09:25:01',
    securityId: 'csi-300-etf',
    price: 4.938,
    quantity: 2000,
    amount: 9876.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-03 09:25:00',
    securityId: 'bond-index-lof',
    price: 1.787,
    quantity: 5600,
    amount: 10007.2,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-06-01 13:24:33',
    securityId: 'star-chip-etf',
    price: 3.446,
    quantity: 2900,
    amount: 9993.4,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-05-26 09:25:00',
    securityId: 'rongda-photosensitive',
    price: 50.0,
    quantity: 100,
    amount: 5000.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-05-12 09:25:01',
    securityId: 'brokerage-etf',
    price: 0.524,
    quantity: 40000,
    amount: 20960.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-05-12 09:25:01',
    securityId: 'innovative-medicine',
    price: 0.668,
    quantity: 45000,
    amount: 30060.0,
    fee: 5.0,
    side: '买入',
  },
  {
    executedAt: '2026-05-12 09:25:00',
    securityId: 'bond-index-lof',
    price: 1.777,
    quantity: 23000,
    amount: 40871.0,
    fee: 6.13,
    side: '买入',
  },
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
    amount: 350000,
    weight: 0.35,
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
    amount: 100000,
    weight: 0.1,
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
    category: '中国红利',
    market: 'sh',
    code: '515080',
    name: '招商中证红利ETF',
    amount: 50000,
    weight: 0.05,
    feeRate: '0.20% + 0.10%',
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
    category: '中国债券',
    market: 'sz',
    code: '161119',
    name: '易方达中债新综指LOF A',
    amount: 200000,
    weight: 0.2,
    feeRate: '0.15% + 0.05%',
  },
];

export const industryPlanAllocations: IndustryPlanAllocation[] = [
  {
    category: '通信/AI算力',
    code: '515880',
    name: '通信ETF国泰',
    currentAmount: 0,
    action: '新买',
    newCashBuy: 35000,
    switchedCashBuy: 0,
    finalAmount: 35000,
    finalWeight: 0.1665,
  },
  {
    category: '科创芯片',
    code: '588200',
    name: '科创芯片ETF嘉实',
    currentAmount: 9998.4,
    action: '继续加仓',
    newCashBuy: 25001.6,
    switchedCashBuy: 0,
    finalAmount: 35000,
    finalWeight: 0.1665,
  },
  {
    category: '创新药',
    code: '516080',
    name: '创新药ETF易方达',
    currentAmount: 40054.5,
    action: '已达目标，暂不加仓',
    newCashBuy: 0,
    switchedCashBuy: 0,
    finalAmount: 40054.5,
    finalWeight: 0.1907,
  },
  {
    category: '电网设备',
    code: '159320',
    name: '电网设备ETF广发',
    currentAmount: 9791,
    action: '继续加仓',
    newCashBuy: 30209,
    switchedCashBuy: 0,
    finalAmount: 40000,
    finalWeight: 0.1904,
  },
  {
    category: '券商',
    code: '512000',
    name: '券商ETF华宝 或同类券商ETF',
    currentAmount: 20965,
    action: '继续加仓',
    newCashBuy: 19035,
    switchedCashBuy: 0,
    finalAmount: 40000,
    finalWeight: 0.1904,
  },
  {
    category: 'AI软件/应用',
    code: '159819',
    name: '人工智能ETF易方达',
    currentAmount: 10144,
    action: '已达目标，暂不加仓',
    newCashBuy: 0,
    switchedCashBuy: 0,
    finalAmount: 10144,
    finalWeight: 0.0483,
  },
  {
    category: '机器人',
    code: '159530',
    name: '机器人ETF易方达',
    currentAmount: 10039.5,
    action: '观察仓，暂不加仓',
    newCashBuy: 0,
    switchedCashBuy: 0,
    finalAmount: 10039.5,
    finalWeight: 0.0477,
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
  return calculateLedgerPositions(securities, trades, getQuoteSymbol);
}

export function calculatePortfolioSummary() {
  return summarizePortfolio(calculatePositions(), trades);
}
