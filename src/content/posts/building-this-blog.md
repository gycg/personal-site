---
title: "这个博客是如何被搭建出来的"
description: "记录我把个人研究博客搭起来的过程：为什么这样选技术、页面怎么组织、部署时做了哪些取舍。"
pubDate: 2026-04-20
tags: ["建站", "Astro", "个人博客"]
draft: false
---

这个博客上线之后，我想把搭建过程先记下来。原因很简单：以后肯定还会继续改版、加栏目、补功能，先把第一版为什么这么做写清楚，后面回头看会省很多时间。

## 为什么选择 Astro + Markdown/MDX + Vercel

我想要的是一个轻一点、稳一点的个人博客，写文章时别被工具链拖住，部署时也别加太多维护负担。基于这个目标，Astro 是很合适的选择。

Astro 默认就适合内容型站点。文章页在构建时生成，访问快，部署简单，也不需要单独维护服务端。对个人博客来说，这一套足够用了。

文章内容使用 Markdown，并保留 MDX 支持。大部分文章写 Markdown 就够了，如果以后要放交互组件或更复杂的内容展示，也不用再换方案。

部署放在 Vercel，主要是图省事。导入 GitHub 仓库后，按默认流程构建就能上线，先用免费域名把博客跑起来没有问题。

## 从零搭建的主要步骤

第一步是先把基础配置定下来：

```txt
package.json
astro.config.mjs
tsconfig.json
src/consts.ts
src/content/config.ts
```

`package.json` 里只保留必要脚本：`dev`、`build`、`preview` 和 `astro`。依赖也控制在最少范围：Astro、MDX 集成、sitemap 集成和 TypeScript。

第二步是把页面结构搭起来。这个博客现在有：

- 首页 `/`
- 文章列表页 `/posts/`
- 文章详情页 `/posts/[slug]/`
- 分类页 `/categories/`
- 标签归档页 `/tags/[tag]/`
- 项目页 `/projects/`
- About 页面 `/about/`

第三步是补内容结构。文章统一放在 `src/content/posts/`，由 content collections 管理。每篇文章都带完整 frontmatter，包括标题、摘要、发布日期、标签和草稿状态。

第四步是把页面样式和右侧栏一起做好。样式集中在 `src/styles/global.css`，没有使用 CSS 框架。这样调试比较直接，也更适合长期维护。

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
  layouts/
    BaseLayout.astro
    PostLayout.astro
  components/
    BackToTop.astro
    PageSidebar.astro
  pages/
    about.astro
    categories/
      index.astro
    index.astro
    posts/
      index.astro
      [slug].astro
    projects/
      index.astro
    tags/
      [tag].astro
  styles/
    global.css
  consts.ts
astro.config.mjs
package.json
README.md
```

`src/pages` 负责路由，`src/layouts` 负责页面外壳和文章页结构，`src/components` 放右侧栏和回到顶部按钮，`src/content/posts` 负责文章内容。站点标题、描述、作者和站点 URL 放在 `src/consts.ts`，后续改站点信息会方便很多。

## 关键实现点

SEO 放在 `BaseLayout.astro` 里统一处理。每个页面传入 `title`、`description`、`type` 和 `canonicalPath` 后，布局会生成 `title`、`description`、canonical、Open Graph 和 Twitter card 基础信息。

文章页使用 Astro 的 content collections。`src/content/config.ts` 定义了文章 frontmatter 的 schema，避免文章元信息随意增长或字段拼错。详情页通过动态路由读取集合内容，然后渲染 Markdown/MDX 正文。

页面布局用了统一的右侧栏结构。首页右边放作者说明、站内导航和最近更新，文章页放按时间和按主题浏览，分类页和项目页也各自有对应的辅助信息。移动端时右侧栏会自动落到正文下方。

全站还加了一个回到顶部按钮。页面往下滚动时按钮会出现，点一下就平滑返回顶部。这个功能很小，但对长文章会更顺手。

标签功能没有单独建数据库，也没有额外配置文件。页面直接从所有文章的 `tags` 字段中收集标签，生成 `/tags/[tag]/` 页面。对个人博客来说，这样足够直接。

sitemap 使用 `@astrojs/sitemap`。在 `astro.config.mjs` 中配置 `site` 和 sitemap 集成后，构建时会生成站点地图。现在 `site` 先使用 `https://example.com` 作为占位，真正部署后应该改成 Vercel 分配的域名或自定义域名。

## 遇到的问题与解决方式

搭建过程中比较实际的问题出在依赖安装和 Node 版本上。Astro 升级到后面的 5.x 版本后，对 Node 版本要求更明确。如果还停在旧版本 Node，本地构建会直接被拦住。

最后的处理方式很直接：把 Astro 升到安全版本，同时把项目运行环境明确到 Node 20。这样本地和 Vercel 都按同一套版本走，后面排查问题也省事。

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

这个版本先把博客的基础骨架搭稳：有首页、文章列表、文章详情、分类、项目、About、基础 SEO 和 sitemap。文章继续用 content collections 管理，后续新增内容只需要复制 Markdown 模板并修改 frontmatter。

后续可以继续优化的方向包括：

- 增加 RSS
- 增加评论或回复模块
- 增加全文搜索
- 增加更完整的项目页内容
- 增加自定义 Open Graph 图片

目前最重要的事情是先把博客跑起来，并保持结构足够简单，方便长期写下去。
