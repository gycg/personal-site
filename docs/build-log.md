# 构建记录

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
