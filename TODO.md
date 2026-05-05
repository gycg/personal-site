# TODO

## 2026-05-05 首轮全站优化记录

已完成：

- 全站模板增加跳到正文链接、统一键盘焦点样式和更完整的页脚低频入口。
- 移动端导航改为紧凑横向滚动，减少小屏首屏占用。
- 全站增加 `WebSite` 结构化数据；文章页增加 `BlogPosting` 和 `BreadcrumbList` 结构化数据。
- 文章页“本文要点”增加空状态，避免无二级标题时渲染空列表。
- 文章页侧栏目录增加滚动高亮。
- 文章归档页按年份分组，并显示公开文章总数和年度文章数。
- 搜索页改为 DOM 安全渲染，增加关键词高亮、空结果建议和 `?q=` URL 同步。
- Giscus 评论语言调整为中文。

第二轮已完成：

- 内容模型增加 `series`、`seriesOrder`、`cover`、`ogImage`、`canonical`、`updatedReason` 可选字段。
- 文章页增加预计阅读时长、所属专题信息和基于标签的相关阅读。
- 文章 JSON-LD 增加分享图字段，并支持文章级 `ogImage` / `cover` 覆盖默认图。
- Giscus 评论脚本改为接近评论区时延迟加载，降低文章页首屏第三方脚本压力。
- 首页增加公开文章数、入门专题数量、研究标签数，强化内容规模信号。
- 首页和归档页文章卡片显示预计阅读时长。
- “从零看懂股票”专题页改为编号阅读路径，并显示专题已发布篇数和阅读时长。

第三轮已完成：

- 新增动态文章 OG 图端点 `/og/[slug].svg`，未显式配置 `cover` / `ogImage` 的文章也会生成专属分享图。
- “从零看懂股票”10 篇文章已补齐 `series` 和 `seriesOrder`。
- 项目页改为读取 `src/data/projects.ts`，项目卡片字段统一维护。
- 搜索页增加标签快捷入口。
- 持仓表格增加小屏横向滑动提示；恐慌指数图表小屏高度和横向可读性优化。
- 正文图片自动补 `loading="lazy"` 和 `decoding="async"`。
- 新增 `npm run check:content` 内容发布检查脚本，检查 frontmatter、图片路径、系列顺序和分享图路径。
- 新增 `src/styles/README.md`，明确后续拆分 `global.css` 的边界和顺序。

后续 TODO：

- 为重点文章补齐更精细的人工 `cover` / `ogImage` 文件；没有人工图时使用动态 OG 图兜底。
- 后续新增专题文章必须补齐 `series`、`seriesOrder`。
- 首页继续强化首屏入口：展示最新文章、专题进度、项目入口之间的优先级。
- 专题页继续增加建议下一篇、专题总阅读时长和更新计划。
- 第三方脚本延迟策略继续优化：不蒜子和 Giscus 可考虑在文章主体进入视口或用户交互后加载。
- 拆分 `src/styles/global.css`，按 layout、article、archive、projects、data-pages 组织样式。
- 在 `src/styles/README.md` 的边界稳定后，逐步把 `global.css` 迁移成多个实际 CSS 文件。
- 继续评估是否引入 `@astrojs/check`，形成 Astro 类型检查。

## 用户回复模块（已完成基础接入）

- 目标：在文章详情页底部增加用户回复/评论能力。
- 推荐方案：优先评估 Giscus，使用 GitHub Discussions 存储评论，保持博客静态部署和低维护成本。
- 预期位置：文章正文下方，属于 `PostLayout.astro` 的文章页能力。
- 需要准备：
  - GitHub 仓库开启 Discussions
  - 安装 Giscus GitHub App
  - 在 giscus.app 生成 `repo`、`repoId`、`category`、`categoryId` 等配置
- 实现要求：
  - 评论模块做成可配置组件，例如 `src/components/Comments.astro`
  - 未配置 Giscus 时不渲染评论区，避免影响构建和部署
  - 更新 README，说明如何开启和修改评论配置
  - 保持 `npm run build` 可通过

当前状态：

- 已新增 `src/components/Comments.astro`。
- 已在 `PostLayout.astro` 的文章正文下方接入。
- 已在 `src/consts.ts` 添加 `GISCUS_CONFIG`，默认 `enabled: false`。
- 已更新 README 的“开启评论”说明。
