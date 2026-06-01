export interface ProjectEntry {
  eyebrow: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  status?: string;
  meta?: Array<{
    label: string;
    value: string;
  }>;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export const projects: ProjectEntry[] = [
  {
    eyebrow: 'Finance Self Study / Textbook Map',
    title: '金融学自学',
    description: '把金融学、公司金融、投资学、估值、计量经济学、金融时间序列、衍生品和财报分析教材整理成一条可执行的自学路线。',
    status: '已上线',
    meta: [
      { label: '定位', value: '学习路线' },
      { label: '内容', value: '教材 / 顺序 / 模块' },
      { label: '状态', value: '已上线' },
    ],
    links: [{ label: '查看金融学自学', href: '/projects/finance-self-study/' }],
  },
  {
    eyebrow: 'Financial Freedom / Execution System',
    title: '财务自由执行路线',
    description: '把“普通人想靠投资实现财务自由”的路线拆成阶段、产出物、风控规则和复盘模板，用 12–24 个月验证主动投资 edge。',
    status: '已上线',
    meta: [
      { label: '定位', value: '执行路线' },
      { label: '内容', value: '阶段 / 模板 / 风控' },
      { label: '状态', value: '已上线' },
    ],
    links: [
      { label: '查看执行路线', href: '/projects/financial-freedom-roadmap/' },
      { label: '阅读原文', href: '/posts/financial-freedom-investing-roadmap/' },
    ],
  },
  {
    eyebrow: 'US Valuation / Live Quotes',
    title: '美股内在价值',
    description: '记录美股公司的每股内在价值、实时股价、相对估值差值和不同持有周期建议。内在价值由手动录入，行情通过公开接口刷新。',
    status: '已上线',
    meta: [
      { label: '定位', value: '美股估值看板' },
      { label: '内容', value: '股价 / 内在价值 / 建议' },
      { label: '状态', value: '已上线' },
    ],
    links: [{ label: '查看美股内在价值', href: '/projects/us-valuation/' }],
  },
  {
    eyebrow: 'Portfolio Tracker / Live Quotes',
    title: '我的持仓（模拟）',
    description: '记录当前 ETF 持仓、买入卖出明细、持仓成本和估算盈亏。页面会尝试读取实时行情，方便把交易记录和当前市值放在一起复盘。',
    status: '已上线',
    meta: [
      { label: '定位', value: '持仓复盘' },
      { label: '内容', value: '交易 / 市值 / 盈亏' },
      { label: '状态', value: '已上线' },
    ],
    links: [{ label: '查看持仓（模拟）', href: '/projects/holdings/' }],
  },
  {
    eyebrow: 'Fear Index / A-share & US',
    title: '恐慌指数',
    description: '把 A 股期权波动率、PCR、股指期货贴水压力和美股 VIX 历史分位数做成每日恐慌分数，并和沪深300、标普500放在同一张图里观察。',
    status: '已上线',
    meta: [
      { label: '定位', value: '风险温度计' },
      { label: '内容', value: 'A股 / 美股 / 指数对照' },
      { label: '状态', value: '已上线' },
    ],
    links: [{ label: '查看指数', href: '/projects/fear-index/' }],
  },
  {
    eyebrow: 'Astro / Markdown / Vercel',
    title: '个人博客',
    description: '公开写作入口，用来沉淀股票入门、公司研究、AI 投研和财务自由实验。结构上保持轻量，方便长期维护和持续写作。',
    status: '持续迭代中',
    meta: [
      { label: '定位', value: '个人研究主页' },
      { label: '内容', value: '文章 / 项目 / 关于' },
      { label: '状态', value: '持续迭代中' },
    ],
    links: [
      { label: '查看首页', href: '/' },
      { label: '阅读文章', href: '/posts/building-this-blog/' },
    ],
  },
  {
    eyebrow: 'Research System / In Progress',
    title: '长期投资研究系统',
    description: '用于整理股票观察池、财报笔记、估值假设和后续跟踪指标。目标是让每一次研究都能沉淀成可复盘的结构化记录。',
    status: '进行中',
    meta: [
      { label: '定位', value: '研究底座' },
      { label: '内容', value: '公司 / 指标 / 跟踪' },
      { label: '状态', value: '进行中' },
    ],
  },
  {
    eyebrow: 'AI Workflow / In Progress',
    title: 'AI 财报阅读工作流',
    description: '用 AI 辅助整理年报、季报、公告和研报，提取关键数据和风险点。AI 负责提高效率，最终判断仍然回到原始材料和商业逻辑。',
    status: '打磨中',
    meta: [
      { label: '定位', value: 'AI 投研工具' },
      { label: '内容', value: '公告 / 财报 / 提纲' },
      { label: '状态', value: '打磨中' },
    ],
  },
  {
    eyebrow: 'Content Pipeline',
    title: '股票趋势视频生产流程',
    description: '从选题、数据整理、脚本、图表到发布，把短视频内容做成可以复用的流水线，减少重复劳动，提高内容一致性。',
    status: '已记录',
    links: [{ label: '阅读记录', href: '/posts/how-i-make-stock-trend-videos/' }],
  },
];
