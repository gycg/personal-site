# 一间小博客

一个简洁的中文个人博客，使用 Astro + Markdown/MDX + content collections 构建，目标部署到 Vercel。

## 功能

- 首页、文章列表页、文章详情页、About 页面
- Markdown/MDX 文章内容
- content collections 管理文章元信息
- 标签归档
- 基础 SEO：title、description、canonical、Open Graph、sitemap
- 响应式布局，移动端可读

## 本地开发

建议使用 Node.js 20 LTS 或更高版本。本项目在 `package.json` 中声明：

```json
{
  "engines": {
    "node": ">=20.19.0",
    "npm": ">=10"
  }
}
```

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

默认构建脚本使用 `astro build`，避免在 Vercel 构建时触发交互式依赖安装提示。

本地预览构建结果：

```bash
npm run preview
```

## 新增文章

复制 `docs/post-template.md`，改成新的文件名，例如：

```txt
src/content/posts/my-new-post.md
```

然后修改 frontmatter：

```yaml
---
title: "文章标题"
description: "文章摘要"
pubDate: 2026-04-20
tags: ["标签"]
draft: false
---
```

正文使用 Markdown；如果需要组件或交互内容，可以创建 `.mdx` 文件。

## 部署到 Vercel

1. 将项目推送到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 新建项目并导入仓库。
3. Framework Preset 选择 `Astro`。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. Install Command 使用 `npm install`。
7. Node.js Version 选择 20 或更高版本。

部署成功后，Vercel 会提供一个免费默认域名，格式通常是：

```txt
https://cphxnotes.com
```

当前项目已配置生产域名为 `https://cphxnotes.com`。重新部署后，canonical URL 和 sitemap 会使用这个站点地址。

## 目录结构

```txt
public/
src/
  content/
    config.ts
    posts/
  layouts/
  pages/
  styles/
  consts.ts
```

核心入口：

- 首页：`src/pages/index.astro`
- 内容目录：`src/content/posts/`
- 文章模板：`docs/post-template.md`
