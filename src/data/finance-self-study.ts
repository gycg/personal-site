export type FinanceTextbook = {
  category: string;
  title: string;
  audience: string;
  focus: string;
  difficulty: string;
};

export const financeTextbooks: FinanceTextbook[] = [
  {
    category: '金融学总论',
    title: '黄达、张杰《金融学》',
    audience: '国内本科、考研、零基础入门',
    focus: '金融体系、货币、银行、金融市场、中国金融制度',
    difficulty: '中等',
  },
  {
    category: '金融学总论',
    title: 'Mishkin《货币金融学》',
    audience: '想学国际通用金融框架的人',
    focus: '利率、央行、货币政策、银行、金融危机',
    difficulty: '中等',
  },
  {
    category: '公司金融',
    title: 'Ross《公司理财》',
    audience: '金融本科、投行、PE/VC方向',
    focus: '投资决策、融资决策、资本结构、估值',
    difficulty: '中等偏难',
  },
  {
    category: '公司金融',
    title: 'Brealey & Myers《公司财务原理》',
    audience: '读研、想深入公司金融理论的人',
    focus: '公司价值、资本预算、风险、融资理论',
    difficulty: '偏难',
  },
  {
    category: '公司金融',
    title: '刘力、唐国正《公司财务》',
    audience: '国内本科、考研',
    focus: '公司金融基础、中文语境案例',
    difficulty: '中等',
  },
  {
    category: '投资学',
    title: 'Bodie, Kane, Marcus《投资学》',
    audience: '金融本科、CFA、资管、证券研究',
    focus: '股票、债券、组合投资、CAPM、市场效率',
    difficulty: '偏难',
  },
  {
    category: '投资学',
    title: 'Bodie《Essentials of Investments》',
    audience: '投资学入门',
    focus: '投资学核心概念，内容比《投资学》精简',
    difficulty: '中等',
  },
  {
    category: '金融市场与机构',
    title: 'Saunders《金融机构管理》',
    audience: '银行、风控、金融机构方向',
    focus: '金融机构风险管理、银行经营、利率风险',
    difficulty: '偏难',
  },
  {
    category: '衍生品',
    title: 'Hull《期权、期货及其他衍生品》',
    audience: '金融工程、量化、风险管理方向',
    focus: '期货、期权、掉期、Black-Scholes、对冲',
    difficulty: '难',
  },
  {
    category: '衍生品',
    title: '汪昌云《金融衍生工具》',
    audience: '国内本科、考研、中文学习者',
    focus: '衍生品基础、期货期权、风险管理',
    difficulty: '中等偏难',
  },
  {
    category: '估值',
    title: 'Damodaran《Investment Valuation》',
    audience: '投行、PE、VC、股票研究',
    focus: 'DCF、相对估值、企业价值、不同资产估值',
    difficulty: '偏难',
  },
  {
    category: '估值',
    title: 'McKinsey《Valuation》',
    audience: '投行、咨询、企业财务方向',
    focus: '企业估值、价值驱动因素、财务建模',
    difficulty: '偏难',
  },
  {
    category: '计量经济学',
    title: 'Wooldridge《计量经济学导论》',
    audience: '金融研究、量化、读研',
    focus: '回归分析、因果推断、面板数据',
    difficulty: '偏难',
  },
  {
    category: '计量经济学',
    title: 'Gujarati《计量经济学基础》',
    audience: '计量入门',
    focus: '回归模型、统计推断、经济数据分析',
    difficulty: '中等',
  },
  {
    category: '金融时间序列',
    title: 'Tsay《Analysis of Financial Time Series》',
    audience: '量化、风控、金融工程',
    focus: '收益率、波动率、ARMA、GARCH、VaR',
    difficulty: '难',
  },
  {
    category: '财报分析',
    title: '《会计学原理》类教材',
    audience: '零基础',
    focus: '借贷记账、三张财务报表、会计基础',
    difficulty: '入门',
  },
  {
    category: '财报分析',
    title: '《财务报表分析》类教材',
    audience: '投资、投行、研究方向',
    focus: '盈利能力、偿债能力、现金流、利润质量',
    difficulty: '中等',
  },
  {
    category: '财报分析',
    title: '姜国华《财务报表分析与证券投资决策》',
    audience: '国内证券投资分析',
    focus: '财报分析与投资判断结合',
    difficulty: '中等偏难',
  },
];

export const financeStudyCategories = Array.from(new Set(financeTextbooks.map((item) => item.category)));

export const financeStudyPath = [
  {
    stage: '01',
    title: '先建立金融系统框架',
    categories: ['金融学总论'],
    output: '画出金融体系、央行、商业银行、金融市场和实体经济之间的关系图。',
  },
  {
    stage: '02',
    title: '补齐公司金融和财报语言',
    categories: ['公司金融', '财报分析'],
    output: '能把一家公司的投资、融资、经营现金流和估值逻辑连起来说明。',
  },
  {
    stage: '03',
    title: '进入投资组合和资产定价',
    categories: ['投资学', '估值'],
    output: '能解释股票、债券、组合、CAPM、市场效率和 DCF/相对估值的使用边界。',
  },
  {
    stage: '04',
    title: '再学机构、衍生品和计量工具',
    categories: ['金融市场与机构', '衍生品', '计量经济学', '金融时间序列'],
    output: '把风险管理、对冲工具、回归分析和波动率模型作为进阶工具，而不是一开始就主攻。',
  },
];
