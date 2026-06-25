export type AnnualResearchOutput = {
  label: string;
  value: string;
  note: string;
};

export type CompanyResearchLayer = {
  layer: string;
  time: string;
  purpose: string;
  companies: string[];
};

export type ResearchWorkflowStep = {
  step: string;
  title: string;
  goal: string;
  outputs: string[];
};

export type MonthlyResearchPlan = {
  month: number;
  title: string;
  companies: string[];
  globalCoordinates?: string[];
  coreQuestion: string;
  weeklyFocus: string[];
  blogTopics: string[];
  deliverables: string[];
  acceptance: string[];
};

export type WeeklyResearchCadence = {
  day: string;
  time: string;
  focus: string;
  output: string;
};

export type BlogPublishingStep = {
  step: string;
  title: string;
  detail: string;
};

export type MonthlyAcceptanceScore = {
  item: string;
  score: number;
};

export type WeeklyChecklist = {
  week: number;
  title: string;
  objective: string;
  checklist: string[];
  deliverables: string[];
  status: '已完成' | '进行中' | '未开始';
  articleHref?: string;
  articleTitle?: string;
  articleSummary?: string;
};

export type MonthlyExecution = {
  month: number;
  title: string;
  objective: string;
  status: '已完成' | '进行中' | '未开始';
  summary: string;
  weeklyChecklists: WeeklyChecklist[];
};

export const annualResearchOutputs: AnnualResearchOutput[] = [
  { label: '公司档案', value: '12 家', note: '每家公司沉淀一页纸，讲清业务、客户、财务和风险。' },
  { label: '公司深度报告', value: '6 份', note: '覆盖重点公司，形成可复盘的完整判断。' },
  { label: '产业链研究', value: '6 份', note: '半导体、AI 算力、软件、自动化、机器人、新能源和储能。' },
  { label: '横向比较报告', value: '4 份', note: '比较不同商业模式、利润分布和竞争优势。' },
  { label: '反方研究', value: '3 份', note: '为重点公司写出清晰的失败路径和失效条件。' },
  { label: '情景估值', value: '3 套', note: '每套都包含悲观、基准和乐观情景。' },
  { label: '核心博客', value: '24 篇', note: '每月 2 篇，用公开写作倒逼研究闭环。' },
  { label: '研究笔记', value: '12 篇', note: '作为可选输出，记录阶段性发现和未解决问题。' },
  { label: '模拟观察组合', value: '1 个', note: '用于记录假设、观察指标和事后复盘。' },
  { label: '个人研究体系', value: '1 份', note: '年底汇总成自己的投研流程、模板和风控边界。' },
];

export const companyResearchLayers: CompanyResearchLayer[] = [
  {
    layer: '第一层：重点公司',
    time: '15-25 小时/家',
    purpose: '做完整公司档案、财务表、竞争优势证据和关键风险。',
    companies: ['中芯国际', '北方华创或中微公司', '海光信息', '金山办公', '汇川技术', '埃斯顿', '绿的谐波', '比亚迪', '宁德时代', '阳光电源'],
  },
  {
    layer: '第二层：对比公司',
    time: '3-8 小时/家',
    purpose: '作为商业模式、产业位置和估值差异的参照物。',
    companies: ['浪潮信息', '宝信软件', '中控技术', '奥比中光', '拓斯达', '亿纬锂能', '德业股份', '寒武纪'],
  },
  {
    layer: '第三层：全球产业坐标',
    time: '不单独写完整报告',
    purpose: '理解技术路线、产业利润分布和全球竞争格局。',
    companies: ['英伟达', '台积电', 'ASML', '特斯拉', '微软'],
  },
];

export const researchWorkflowSteps: ResearchWorkflowStep[] = [
  {
    step: '01',
    title: '公司卡片',
    goal: '用一小时回答公司卖什么、客户是谁、为什么付钱、收入和成本从哪里来。',
    outputs: ['一页纸公司卡片', '三分钟口头解释', '暂不判断股价'],
  },
  {
    step: '02',
    title: '商业模式图',
    goal: '画清供应商、公司、客户和最终使用者，标出定价权、资本开支、库存风险和利润留存。',
    outputs: ['供应商-公司-客户流程图', '成本随收入变化说明', '利润环节判断'],
  },
  {
    step: '03',
    title: '三年年报',
    goal: '按业务概要、管理层讨论、收入结构、风险因素和三张表的顺序阅读最近三年年报。',
    outputs: ['三年收入、利润、现金流摘要', '好转/恶化清单', '管理层未解释问题'],
  },
  {
    step: '04',
    title: '核心财务表',
    goal: '整理最近五年收入、利润率、现金流、资本开支、应收、存货、研发和净债务。',
    outputs: ['15 项核心指标表', '四类背离检查', '三个健康指标和三个警惕指标'],
  },
  {
    step: '05',
    title: '竞争优势证据',
    goal: '把“技术领先”“客户黏性”“成本优势”等判断落到可验证证据上。',
    outputs: ['至少三项支持证据', '至少两项削弱证据', '优势是否可持续的结论'],
  },
  {
    step: '06',
    title: '三情景估值',
    goal: '用悲观、基准、乐观三种情景预测三至五年后的收入、利润率、现金流和估值倍数。',
    outputs: ['价格区间', '关键假设表', '估值依赖条件'],
  },
  {
    step: '07',
    title: '反方报告',
    goal: '强迫自己写出公司失败路径、技术替代、客户流失、政策变化和财务恶化信号。',
    outputs: ['一页反方报告', '至少三个失效条件', '重新评估触发指标'],
  },
];

export const monthlyResearchPlan: MonthlyResearchPlan[] = [
  {
    month: 1,
    title: '财务报表与研究习惯',
    companies: ['金山办公', '比亚迪'],
    coreQuestion: '软件公司与制造业公司的财务结构为什么完全不同？',
    weeklyFocus: ['建立文件夹和研究总表', '研究金山办公', '研究比亚迪', '对比财务结构并写作'],
    blogTopics: ['读懂上市公司年报：普通投资者先看哪几个数字？', '同样是科技公司，软件与制造业的财务结构为什么完全不同？'],
    deliverables: ['两张公司一页纸卡片', '两张商业模式图', '15 项核心财务指标表', '一篇 500 字研究笔记'],
    acceptance: ['能解释利润与现金流的区别', '能说出两家公司最大财务差异', '完成 2 篇博客'],
  },
  {
    month: 2,
    title: '商业模式与护城河',
    companies: ['金山办公', '浪潮信息', '中芯国际'],
    coreQuestion: '什么样的生意更容易持续赚钱？',
    weeklyFocus: ['软件订阅模式', '服务器硬件模式', '晶圆制造模式', '横向比较'],
    blogTopics: ['研究一家公司，首先要弄清它怎样赚钱', '订阅软件、服务器和晶圆制造，哪种商业模式更好？'],
    deliverables: ['三家公司商业模式比较表', '客户-产品-成本-利润流程图', '1500 字横向比较报告'],
    acceptance: ['能区分产品好、技术强和生意好的差别', '能说明每增加一元收入需要增加什么成本'],
  },
  {
    month: 3,
    title: '半导体产业链',
    companies: ['中芯国际', '北方华创', '中微公司'],
    globalCoordinates: ['台积电', 'ASML'],
    coreQuestion: '研究半导体设备公司，为什么客户验证比技术发布更重要？',
    weeklyFocus: ['芯片制造流程', '中芯国际产能与资本开支', '北方华创与中微公司比较', '产业链图和文章'],
    blogTopics: ['一颗芯片是怎样制造出来的？', '研究半导体设备公司，为什么客户验证比技术发布更重要？'],
    deliverables: ['半导体制造流程图', '设备公司比较表', '半导体产业报告'],
    acceptance: ['能讲清光刻、刻蚀、薄膜沉积等环节', '知道折旧和资本开支如何影响晶圆厂利润'],
  },
  {
    month: 4,
    title: 'AI 算力',
    companies: ['海光信息', '浪潮信息', '寒武纪'],
    globalCoordinates: ['英伟达'],
    coreQuestion: 'AI 产业快速增长，利润最终留在哪一层？',
    weeklyFocus: ['CPU、GPU 和加速芯片基础', '海光信息商业模式和客户', '浪潮信息服务器模式', '芯片与服务器公司对比'],
    blogTopics: ['AI 产业很大，为什么不代表所有 AI 公司都值得投资？', '芯片公司和服务器公司，谁更可能赚到 AI 时代的利润？'],
    deliverables: ['AI 算力产业链图', '上下游议价能力表', '海光信息一页纸研究报告'],
    acceptance: ['能区分算力需求、芯片能力和服务器交付', '能说明利润为什么不平均分布'],
  },
  {
    month: 5,
    title: '软件与工业数字化',
    companies: ['金山办公', '宝信软件', '中控技术'],
    coreQuestion: '软件公司是靠产品赚钱，还是靠大量项目和销售人员赚钱？',
    weeklyFocus: ['订阅制与项目制', '金山办公', '宝信软件与中控技术', '收入质量比较'],
    blogTopics: ['软件公司为什么看起来是一门好生意？', '订阅制软件和项目制软件，哪一种收入质量更高？'],
    deliverables: ['软件公司指标表', '项目制与订阅制比较', '工业软件研究报告'],
    acceptance: ['能区分高毛利软件和高人力项目', '能用现金流和续费指标检验收入质量'],
  },
  {
    month: 6,
    title: '工业自动化',
    companies: ['汇川技术', '中控技术', '埃斯顿'],
    coreQuestion: '制造业自动化升级，谁能真正获得利润？',
    weeklyFocus: ['变频器、伺服、控制器基础', '汇川技术深度研究', '中控技术对照', '埃斯顿对比卡片'],
    blogTopics: ['工业自动化为什么可能是一门长期生意？', '从单一产品到平台型企业，汇川技术需要跨过哪些门槛？'],
    deliverables: ['自动化产品地图', '汇川技术深度报告', '埃斯顿对比卡片'],
    acceptance: ['能说明国产替代与制造业资本开支周期的关系', '能判断产品线扩张是否带来真实平台能力'],
  },
  {
    month: 7,
    title: '机器人产业链',
    companies: ['埃斯顿', '汇川技术', '拓斯达'],
    coreQuestion: '机器人产业中，本体、零部件和集成商谁更有价值？',
    weeklyFocus: ['产业地图', '工业机器人应用场景', '商业化证据', '本体、零部件、集成商横向比较'],
    blogTopics: ['机器人产业链到底有哪些环节？', '工业机器人和人形机器人有什么本质区别？'],
    deliverables: ['机器人产业链图', '本体、零部件、集成商比较表', '埃斯顿公司卡片'],
    acceptance: ['能区分样机、订单、交付和回款', '能说明毛利率和应收账款为什么重要'],
  },
  {
    month: 8,
    title: '机器人核心零部件与具身智能',
    companies: ['绿的谐波', '奥比中光', '汇川技术'],
    coreQuestion: '人形机器人如果规模增长，哪些部件可能最先获得收入？',
    weeklyFocus: ['减速器、电机和伺服', '丝杠、编码器和力传感器', '3D 视觉与灵巧手', '商业化证据清单'],
    blogTopics: ['机器人的电机、减速器和传感器分别有什么作用？', '机器人零部件公司会比整机公司更赚钱吗？'],
    deliverables: ['单台机器人价值量估算表', '核心部件技术路线表', '绿的谐波深度报告', '机器人商业化证据清单'],
    acceptance: ['检查相关业务收入占比', '检查是否批量交付和客户付款', '检查当前市值隐含多少未来销量'],
  },
  {
    month: 9,
    title: '新能源汽车与电池',
    companies: ['比亚迪', '宁德时代'],
    globalCoordinates: ['特斯拉'],
    coreQuestion: '销量增长能否转化为长期股东回报？',
    weeklyFocus: ['汽车公司的收入与成本', '比亚迪单车经济性', '宁德时代电池产业', '整车与电池比较'],
    blogTopics: ['研究汽车公司，为什么不能只看销量？', '宁德时代的护城河来自技术、规模还是客户？'],
    deliverables: ['比亚迪单车收入和利润表', '宁德时代成本传导图', '新能源汽车产业利润分布图'],
    acceptance: ['能解释销量、收入和利润的关系', '能判断价格战对利润率和现金流的影响'],
  },
  {
    month: 10,
    title: '储能与未来产业观察',
    companies: ['阳光电源', '亿纬锂能或德业股份'],
    coreQuestion: '一家公司拥有未来产业概念，是否真的拥有未来产业收入？',
    weeklyFocus: ['储能产业链', '阳光电源商业模式', '亿纬锂能或德业股份对照', '低空经济、商业航天、脑机接口、量子科技、6G 观察框架'],
    blogTopics: ['储能行业增长很快，利润可能留在哪个环节？', '一家公司拥有未来产业概念，不代表它拥有未来产业收入'],
    deliverables: ['储能产业链图', '未来产业观察池', '技术成熟度评分表'],
    acceptance: ['能区分样机、试产和量产', '能检查相关收入占比和客户付款情况'],
  },
  {
    month: 11,
    title: '估值与反方研究',
    companies: ['中芯国际或北方华创', '汇川技术或绿的谐波', '宁德时代或阳光电源'],
    coreQuestion: '好公司为什么也可能不是好股票？',
    weeklyFocus: ['半导体三情景估值', '自动化或机器人三情景估值', '新能源三情景估值', '反方报告和逻辑失效指标'],
    blogTopics: ['好公司为什么也可能不是好股票？', '不用精确预测，也能给公司估值吗？'],
    deliverables: ['三套估值模型', '三份反方报告', '估值假设表', '逻辑失效指标表'],
    acceptance: ['每家公司都有悲观、基准、乐观情景', '每家公司都有可观察的重新评估触发条件'],
  },
  {
    month: 12,
    title: '年度复盘与个人体系',
    companies: ['全年研究对象'],
    coreQuestion: '研究了一年 A 股科技公司后，哪些东西真正进入了自己的研究体系？',
    weeklyFocus: ['公司分组：真正理解、继续观察、暂时看不懂、明确回避', '研究错误清单', '模拟组合复盘', '下一年度重点方向和个人体系文档'],
    blogTopics: ['研究了一年 A 股科技公司后，我学会了什么？', '我的 A 股科技与未来产业研究框架'],
    deliverables: ['年度公司分类表', '研究错误清单', '模拟组合复盘', '下一年度重点方向', '个人研究体系文档'],
    acceptance: ['能解释每家公司被放入某组的原因', '能指出下一年应该保留、删除和强化的研究动作'],
  },
];

export const weeklyResearchCadence: WeeklyResearchCadence[] = [
  { day: '周一', time: '30 分钟', focus: '阅读公司公告和年报章节', output: '只读原始资料，不看股价讨论。' },
  { day: '周二', time: '45 分钟', focus: '整理财务数据', output: '每次只更新一个模块，如收入、利润率、现金流或应收账款。' },
  { day: '周三', time: '45 分钟', focus: '学习一个产业主题', output: '例如减速器、伺服、视觉或控制器，只解决一个小问题。' },
  { day: '周四', time: '45 分钟', focus: '研究竞争者或上下游', output: '回答客户还有什么选择、供应商是否掌握定价权。' },
  { day: '周五', time: '30 分钟', focus: '写研究日志', output: '记录本周新发现、未解决问题和原有判断是否变化。' },
  { day: '周六', time: '3 小时', focus: '连续深度研究', output: '整理资料、补数据、找反面证据、建立文章论点并完成初稿。' },
  { day: '周日', time: '1 小时', focus: '修改博客和周复盘', output: '删除无法证实的结论，补来源，列出下周三个问题。' },
];

export const blogPublishingWorkflow: BlogPublishingStep[] = [
  { step: '01', title: '确定一个问题', detail: '题目要具体，例如“电池价格下降，对宁德时代到底是好事还是坏事？”' },
  { step: '02', title: '写出一句核心观点', detail: '先把文章的判断压缩成一句话，避免写成材料堆叠。' },
  { step: '03', title: '建立证据表', detail: '每个观点都要列支持证据、反面证据和证据是否充分。' },
  { step: '04', title: '写文章结构', detail: '统一使用：问题、重要性、商业逻辑、数据证据、反面情况、当前结论、后续指标。' },
  { step: '05', title: '完成初稿', detail: '核心文章控制在 2000-3500 字，先完成，再补证据。' },
  { step: '06', title: '事实检查', detail: '检查公司名称、年度、同比环比、利润现金流、预测和事实、反方观点。' },
  { step: '07', title: '发布后复盘', detail: '三个月后重新阅读，标记正确判断、错误判断、缺少数据和情绪影响。' },
];

export const monthlyAcceptanceScore: MonthlyAcceptanceScore[] = [
  { item: '完成原始资料阅读', score: 2 },
  { item: '完成公司或产业图', score: 1 },
  { item: '完成财务数据整理', score: 2 },
  { item: '找到反面证据', score: 1 },
  { item: '完成研究报告', score: 2 },
  { item: '发布两篇博客', score: 2 },
];

export const firstWeekChecklist = [
  '第 1 天：建立文件夹、年度总表、金山办公和比亚迪公司卡片。',
  '第 2 天：下载两家公司最近三年年报，找到收入、利润、现金流和研发费用。',
  '第 3 天：写出金山办公“客户-产品-收费方式”，不超过 300 字。',
  '第 4 天：写出比亚迪“客户-产品-成本结构”，不超过 300 字。',
  '第 5 天：比较两家公司的毛利率、资本开支和现金流。',
  '第 6 天：用 3 小时完成两家公司商业模式图、财务指标表和第一篇博客提纲。',
  '第 7 天：完成《读懂上市公司年报：普通投资者先看哪几个数字？》初稿。',
];

export const monthOneWeeklyChecklists: WeeklyChecklist[] = [
  {
    week: 1,
    title: '建立系统与财报入口',
    objective: '先跑通最小研究链条：找资料、建公司卡片、整理核心数字、写出第一篇过程记录。',
    checklist: firstWeekChecklist,
    deliverables: ['2 张公司卡片', '1 张财务比较表', '2 张商业模式图', '1 篇博客初稿', '1 份下周问题清单'],
    status: '已完成',
    articleHref: '/posts/annual-report-reading-week-one-kingsoft-byd/',
    articleTitle: '读懂上市公司年报：我用金山办公和比亚迪完成第一周练习',
    articleSummary: '完成金山办公和比亚迪公司卡片、近三年核心财务表、商业模式图、毛利率/资本开支/现金流对比，并记录资料来源和下一周问题清单。',
  },
  {
    week: 2,
    title: '研究金山办公',
    objective: '拆解软件公司的收入结构、订阅逻辑、研发投入、现金流质量和 AI 商业化证据。',
    checklist: [
      '第 1 天：重读金山办公最近三年年报的业务概要和管理层讨论。',
      '第 2 天：整理 WPS 个人业务、WPS 365、WPS 软件业务收入及增速。',
      '第 3 天：分析毛利率、研发投入、研发人员占比和经营现金流。',
      '第 4 天：研究用户为什么更换办公软件困难，列出产品粘性证据。',
      '第 5 天：查找 AI 功能是否形成实际收费或带动付费转化的证据。',
      '第 6 天：画出金山办公商业模式图和财务指标表。',
      '第 7 天：完成一篇金山办公研究记录，并列出下一步待验证问题。',
    ],
    deliverables: ['金山办公商业模式图', '收入结构表', '核心财务指标表', 'AI 商业化证据表', '第 2 周执行记录文章'],
    status: '已完成',
    articleHref: '/posts/kingsoft-office-week-two-research/',
    articleTitle: '金山办公靠什么赚钱：第2周研究记录',
    articleSummary: '拆解 WPS 个人业务、WPS 365、WPS 软件业务、毛利率、研发投入、经营现金流、用户迁移成本和 AI 商业化证据。',
  },
  {
    week: 3,
    title: '研究比亚迪',
    objective: '拆解制造业公司的销量、收入、利润、资本开支、存货和经营现金流之间的关系。',
    checklist: [
      '第 1 天：重读比亚迪最近三年年报的业务概要和管理层讨论。',
      '第 2 天：拆解汽车、手机部件、二次充电电池等业务收入结构。',
      '第 3 天：整理销量、收入、毛利率和净利润之间的关系。',
      '第 4 天：研究存货、资本开支和经营现金流的变化。',
      '第 5 天：理解垂直整合对成本、供应链和利润率的影响。',
      '第 6 天：画出比亚迪商业模式图和财务指标表。',
      '第 7 天：完成一篇比亚迪研究记录，并列出下一步待验证问题。',
    ],
    deliverables: ['比亚迪商业模式图', '收入结构表', '核心财务指标表', '存货与资本开支检查表', '第 3 周执行记录文章'],
    status: '已完成',
    articleHref: '/posts/byd-week-three-research/',
    articleTitle: '研究比亚迪，为什么不能只看销量：第3周研究记录',
    articleSummary: '拆解汽车业务、手机部件业务、销量、利润、资本开支、存货、经营现金流和垂直整合的优势与代价。',
  },
  {
    week: 4,
    title: '软件与制造业对比写作',
    objective: '把金山办公和比亚迪放在同一张表里，解释软件公司与制造业公司的财务结构差异。',
    checklist: [
      '第 1 天：对比两家公司的收入结构和毛利率。',
      '第 2 天：对比研发投入、资本开支和资产结构。',
      '第 3 天：对比经营现金流、存货、应收账款和合同负债。',
      '第 4 天：提炼软件公司与制造业公司的三类核心差异。',
      '第 5 天：寻找反面证据，避免简单得出“软件一定更好”的结论。',
      '第 6 天：完成《同样是科技公司，软件与制造业的财务结构为什么完全不同？》初稿。',
      '第 7 天：做第一个月复盘，按 10 分制验收完成情况。',
    ],
    deliverables: ['软件与制造业比较表', '反方证据清单', '第 4 周对比文章', '第一个月复盘表'],
    status: '已完成',
    articleHref: '/posts/software-vs-manufacturing-financial-structure/',
    articleTitle: '同样是科技公司，软件与制造业的财务结构为什么完全不同？',
    articleSummary: '把金山办公和比亚迪放在一起比较，完成第一个月的财务结构对比、月度评分和后续研究规则。',
  },
];

export const monthlyExecutions: MonthlyExecution[] = [
  {
    month: 1,
    title: '财务报表与研究习惯',
    objective: '用金山办公和比亚迪跑通最小研究闭环，理解软件公司与制造业公司的财务结构差异。',
    status: '已完成',
    summary: '已完成公司卡片、财务表、商业模式图、两家公司研究记录、横向比较文章和第一个月复盘。',
    weeklyChecklists: monthOneWeeklyChecklists,
  },
  {
    month: 2,
    title: '商业模式与护城河',
    objective: '比较软件订阅、服务器硬件和晶圆制造三种生意，判断什么样的商业模式更容易持续赚钱。',
    status: '已完成',
    summary: '已完成金山办公软件订阅、浪潮信息服务器硬件、中芯国际晶圆制造和三类商业模式横向比较，形成“每增加一元收入需要增加什么成本”的商业模式检查框架。',
    weeklyChecklists: [
      {
        week: 1,
        title: '软件订阅模式',
        objective: '回到金山办公，重点看订阅、续费、迁移成本和组织客户扩容。',
        checklist: ['重读金山办公收入结构', '整理个人业务与 WPS 365 的增长逻辑', '补充续费和客户粘性证据', '写出软件订阅模式的优势与限制'],
        deliverables: ['软件订阅模式卡片', '订阅收入质量检查表'],
        status: '已完成',
        articleHref: '/posts/software-subscription-business-model-kingsoft-office/',
        articleTitle: '研究一家公司，首先要弄清它怎样赚钱：金山办公的软件订阅模式',
        articleSummary: '回到金山办公，拆解个人订阅、WPS 365、AI 办公和组织客户黏性，明确软件订阅不是天然护城河。',
      },
      {
        week: 2,
        title: '服务器硬件模式',
        objective: '研究浪潮信息，理解服务器硬件公司的收入、毛利率、库存和客户集中度。',
        checklist: ['建立浪潮信息公司卡片', '整理服务器业务收入与毛利率', '检查存货和应收账款', '分析 AI 服务器需求如何传导到利润'],
        deliverables: ['浪潮信息公司卡片', '服务器硬件商业模式图'],
        status: '已完成',
        articleHref: '/posts/inspur-server-hardware-business-model/',
        articleTitle: '服务器硬件公司怎样赚钱：浪潮信息第2个月第2周研究记录',
        articleSummary: '用浪潮信息理解 AI 算力需求如何先传导到收入，再受物料成本、库存、回款和客户议价约束。',
      },
      {
        week: 3,
        title: '晶圆制造模式',
        objective: '研究中芯国际，理解晶圆制造的资本开支、折旧、产能利用率和周期属性。',
        checklist: ['建立中芯国际公司卡片', '整理产能、资本开支和折旧', '区分成熟制程与先进制程', '分析客户结构和行业周期'],
        deliverables: ['中芯国际公司卡片', '晶圆制造商业模式图'],
        status: '已完成',
        articleHref: '/posts/smic-wafer-foundry-business-model/',
        articleTitle: '晶圆制造为什么是重资本生意：中芯国际第2个月第3周研究记录',
        articleSummary: '用中芯国际理解晶圆制造的资本开支、折旧、产能利用率、客户验证和周期属性。',
      },
      {
        week: 4,
        title: '商业模式横向比较',
        objective: '把订阅软件、服务器硬件和晶圆制造放在同一框架下比较。',
        checklist: ['比较客户、产品、成本和利润留存', '寻找三类生意的反方证据', '完成横向比较提纲', '发布商业模式对比文章'],
        deliverables: ['三家公司商业模式比较表', '1500 字横向比较报告', '第 2 个月复盘'],
        status: '已完成',
        articleHref: '/posts/subscription-server-foundry-business-model-comparison/',
        articleTitle: '订阅软件、服务器和晶圆制造，哪种商业模式更好？',
        articleSummary: '把金山办公、浪潮信息和中芯国际放在同一张商业模式表里，比较客户、成本、利润留存、护城河和反方证据。',
      },
    ],
  },
];

export const executionGuardrails = [
  '不要同时深度研究超过三家公司。',
  '不要因为股价突然上涨而临时换研究对象。',
  '不要把每天看行情算作研究时间。',
  '不要只收集材料而不写结论。',
  '不要因为看不懂，就直接采用券商或博主结论。',
  '不要把“行业可能爆发”直接等同于“上市公司利润会爆发”。',
  '早期产业始终检查：相关业务收入占比、是否交付、客户是否付款、利润是否真实、当前市值提前反映了多少未来。',
];
