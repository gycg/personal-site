# 构建记录

## 2026-05-05

- 执行首轮全站体验优化，重点覆盖全站模板、文章页、搜索页、文章归档和维护文档。
- `BaseLayout.astro` 增加跳到正文链接、页脚低频入口和 `WebSite` JSON-LD。
- `PostLayout.astro` 增加 `BlogPosting`、`BreadcrumbList` JSON-LD，文章要点空状态和目录滚动高亮。
- `PageSidebar.astro` 为页内目录链接增加可识别属性，供文章页目录高亮脚本使用。
- `search.astro` 改为 DOM API 渲染结果，增加关键词高亮、空结果建议和 URL 查询同步。
- `posts/index.astro` 改为按年份分组归档，并显示文章总数和年度文章数。
- `global.css` 增加全站焦点样式、跳正文链接、移动端紧凑导航、页脚导航、搜索高亮和归档样式。
- `GISCUS_CONFIG.lang` 调整为 `zh-CN`。
- 继续执行第二轮优化：扩展文章内容模型，支持 `series`、`seriesOrder`、`cover`、`ogImage`、`canonical`、`updatedReason`。
- 文章页增加预计阅读时长、专题标记、基于共同标签的相关阅读，并让文章级分享图进入 Open Graph 和 JSON-LD。
- 评论区改为接近底部时动态加载 Giscus 脚本，减少首屏第三方脚本影响。
- 首页增加公开文章、专题和标签数量；文章卡片增加预计阅读时长。
- “从零看懂股票”专题页改为编号阅读路径，强化顺序阅读体验。
- 第三轮继续收口：新增 `/og/[slug].svg` 动态文章分享图端点，每篇文章构建时生成专属 SVG OG 图。
- 给“从零看懂股票”10 篇文章补齐 `series` 和 `seriesOrder` frontmatter。
- 项目页改为读取 `src/data/projects.ts`，统一项目卡片数据结构。
- 搜索页增加标签快捷入口，持仓页表格增加小屏横向滑动提示，恐慌指数图表优化小屏可读性。
- 新增 `scripts/check-content.mjs` 与 `npm run check:content`，用于检查文章 frontmatter、图片路径、系列顺序和分享图路径。
- 新增 `src/styles/README.md`，记录后续拆分 `global.css` 的边界。
- 清理 `.astro` 内容缓存后重新构建，消除重复内容 id 警告。

## 2026-04-20

- 检查当前目录：目录为空，没有已有 Git 仓库，也没有项目文件。
- 技术方案：使用 Astro + Markdown/MDX + content collections，部署目标为 Vercel。
- 依赖选择：只安装 Astro、MDX 集成、sitemap 集成和 TypeScript，不引入前端框架或 CSS 框架。
- 项目结构：采用 `src/pages` 路由、`src/layouts` 布局、`src/content/posts` 存放文章。
- 实现页面：完成首页、文章列表、文章详情、标签归档和 About 页面。
- 实现布局：`BaseLayout.astro` 负责 SEO、OG、导航和页脚，`PostLayout.astro` 负责文章页。
- 样式策略：使用单个 `src/styles/global.css`，不引入 CSS 框架，重点处理阅读宽度、移动端布局、文章排版和标签样式。
- 遇到的问题：`npm install` 在当前环境下长时间无输出。使用 verbose 后确认 npm 解析到了较新的依赖版本，其中部分包要求 Node 18.20.8 或 Node 20，而当前环境是 Node 18.19.1；同时下载过程中出现 `ECONNRESET`。
- 解决方式：把 Astro、MDX、sitemap 和 TypeScript 固定到兼容当前环境的版本，避免 `^` 自动解析到更高 engine 要求的版本。
- 构建脚本调整：`astro check` 需要额外安装 `@astrojs/check`，当前网络多次在安装该包时中断。为了让本地和 Vercel 的默认构建非交互、可重复，默认 `npm run build` 使用 `astro build`。
- 安全审计：固定在 Astro 5.1.1 后 `npm audit` 报告 Astro/esbuild 漏洞。升级到 `astro@5.18.1` 后审计为 0 漏洞。
- Node 版本要求：`astro@5.18.1` 要求 Node >= 18.20.8，且部分依赖要求 Node 20.19。项目最终声明 Node >= 20.19.0，并使用临时 Node 20 环境完成验证。
- 最终验证：使用 Node 20.20.2 和 npm 10.9.8 运行 `npm run build` 成功，生成 13 个静态页面和 sitemap。
- 路由检查：首页、文章列表页、首篇文章详情页、About 页面、标签页均返回 200。
- SEO 检查：首篇文章页包含 title、description、canonical、Open Graph 和 Twitter card 基础元信息。
