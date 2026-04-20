---
title: "这个博客是如何被搭建出来的"
description: "记录我从空目录开始，用 Astro、Markdown/MDX 和 Vercel 部署目标搭建这个中文个人博客的真实过程。"
pubDate: 2026-04-20
tags: ["Astro", "建站", "Vercel"]
draft: false
---

这篇文章是这个博客的第一篇正式文章。它不是一篇脱离实际项目的教程，而是一次完整建站过程的记录：从检查空目录开始，到确定技术栈、组织目录、实现页面、补齐 SEO，再到准备部署到 Vercel。

## 为什么选择 Astro + Markdown/MDX + Vercel

这个博客的目标很明确：中文内容为主，长期维护，页面简单，重点放在阅读体验和内容结构上。基于这个目标，我选择了 Astro。

Astro 的默认输出适合静态站点，文章页可以在构建时生成，访问速度快，也不需要维护服务端。对于个人博客来说，这比引入一个完整前端应用框架更轻。页面里暂时没有复杂交互，所以没有安装 React、Vue 或其他 UI 框架。

文章内容使用 Markdown，并预留 MDX 支持。Markdown 适合普通文章，写作成本低；MDX 则给后续留下空间，如果某篇文章确实需要嵌入组件，可以直接使用 `.mdx` 文件。

部署目标选择 Vercel，是因为 Astro 项目可以用默认构建流程直接部署：安装依赖，运行 `npm run build`，输出目录是 `dist/`。对于个人博客，Vercel 的默认免费域名也足够先上线验证。

## 从零搭建的主要步骤

第一步是检查目录状态。当前目录是空的，也不是已有 Git 仓库，所以可以直接从零创建项目文件，不需要迁移旧代码或处理已有改动。

第二步是创建基础配置：

```txt
package.json
astro.config.mjs
tsconfig.json
src/consts.ts
src/content/config.ts
```

`package.json` 里只保留必要脚本：`dev`、`build`、`preview` 和 `astro`。依赖也控制在最少范围：Astro、MDX 集成、sitemap 集成和 TypeScript。

第三步是实现页面结构。这个博客现在有：

- 首页 `/`
- 文章列表页 `/posts/`
- 文章详情页 `/posts/[slug]/`
- 标签归档页 `/tags/[tag]/`
- About 页面 `/about/`

第四步是补齐内容结构。文章统一放在 `src/content/posts/`，由 content collections 管理。每篇文章都需要完整 frontmatter，包括标题、摘要、发布日期、标签和草稿状态。

第五步是写样式。样式集中在 `src/styles/global.css`，没有使用 CSS 框架。这样做的好处是结构直接、调试简单，也避免为了一个小博客引入过多约束。

## 目录结构说明

目前项目的核心目录如下：

```txt
public/
  favicon.svg
src/
  content/
    config.ts
    posts/
      building-this-blog.md
      markdown-writing-workflow.md
      keeping-a-small-site-maintainable.md
  layouts/
    BaseLayout.astro
    PostLayout.astro
  pages/
    about.astro
    index.astro
    posts/
      index.astro
      [slug].astro
    tags/
      [tag].astro
  styles/
    global.css
  consts.ts
astro.config.mjs
package.json
README.md
```

`src/pages` 负责路由，`src/layouts` 负责页面外壳和文章页结构，`src/content/posts` 负责文章内容。站点标题、描述、作者和站点 URL 放在 `src/consts.ts`，后续要改站点信息时不用到处找。

## 关键实现点

SEO 放在 `BaseLayout.astro` 里统一处理。每个页面可以传入 `title`、`description`、`type` 和 `canonicalPath`，布局会生成 `title`、`description`、canonical、Open Graph 和 Twitter card 基础信息。

文章页使用 Astro 的 content collections。`src/content/config.ts` 定义了文章 frontmatter 的 schema，避免文章元信息随意增长或字段拼错。详情页通过动态路由读取集合内容，然后渲染 Markdown/MDX 正文。

标签功能没有单独建数据库，也没有额外配置文件。页面直接从所有文章的 `tags` 字段中收集标签，生成 `/tags/[tag]/` 页面。对当前规模的个人博客来说，这样更直接。

sitemap 使用 `@astrojs/sitemap`。在 `astro.config.mjs` 中配置 `site` 和 sitemap 集成后，构建时会生成站点地图。现在 `site` 先使用 `https://example.com` 作为占位，真正部署后应该改成 Vercel 分配的域名或自定义域名。

## 遇到的问题与解决方式

搭建过程中遇到的第一个问题是依赖安装。第一次执行 `npm install` 长时间没有输出，第二次加了更短的网络超时参数后仍然卡住。为了不让安装阻塞全部实现，我先中止安装，继续完成源码和内容，最后再集中验证。

这个处理方式的原则是：依赖清单和源码结构先保持清晰，安装问题留到验证阶段单独处理。这样可以区分项目代码问题和本地环境问题。

后面又遇到一个更实际的问题：为了兼容当前机器的 Node 18.19.1，我一度把 Astro 固定在较早的 5.1.1。但 `npm audit` 提示这个版本链路里有 Astro/esbuild 相关漏洞。最后我选择升级到 `astro@5.18.1`，把安全问题解决掉，同时在项目里明确要求 Node 20。

这也是为什么 `package.json` 里有 `engines` 字段，`.nvmrc` 里也写了 `20`。个人博客虽然简单，但依赖版本和运行时版本还是应该说清楚，尤其是准备部署到 Vercel 时。

另一个需要注意的点是站点 URL。sitemap 和 canonical URL 都依赖 `site` 配置。项目刚创建时还没有真实线上域名，所以先放占位值。部署到 Vercel 后，应把它改成实际的 Vercel 默认域名，例如 `https://your-project.vercel.app`。

## 本地运行方式

本地开发流程很简单：

```bash
nvm use 20
npm install
npm run dev
```

开发服务器启动后，打开终端输出的本地地址即可查看博客。

构建检查使用：

```bash
npm run build
```

构建产物会输出到 `dist/`。

## 部署到 Vercel 的方式

最直接的方式是把项目推送到 GitHub，然后在 Vercel 新建项目并导入仓库。

Vercel 中保持默认 Astro 配置即可：

- Framework Preset：Astro
- Build Command：`npm run build`
- Output Directory：`dist`
- Install Command：`npm install`

如果先使用 Vercel 免费默认域名，部署完成后把 `astro.config.mjs` 和 `src/consts.ts` 里的 `https://example.com` 改成 Vercel 给出的 `https://项目名.vercel.app`，然后重新部署。

## 总结与后续可优化方向

这个版本先完成一个稳定、轻量、可发布的个人博客：有首页、文章列表、文章详情、About、标签、基础 SEO 和 sitemap。文章用 content collections 管理，后续新增内容只需要复制现有 Markdown 文件并修改 frontmatter。

后续可以继续优化的方向包括：

- 增加 RSS
- 增加全文搜索
- 增加文章目录
- 增加自定义 Open Graph 图片
- 增加更完整的中文排版细节

目前最重要的事情是先把博客跑起来，并保持结构足够简单，方便长期写下去。
