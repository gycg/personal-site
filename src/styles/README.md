# Stylesheet Maintenance

`global.css` 仍是当前唯一入口，避免 Astro 页面重复引入样式造成顺序问题。后续拆分时按下面边界迁移，并保持 `BaseLayout.astro` 只导入一个入口文件。

建议拆分顺序：

- `tokens.css`：`:root` 变量、基础字体、背景、链接、焦点、shell。
- `layout.css`：header、nav、footer、grid、sidebar、hero、section head。
- `article.css`：prose、article header、summary、post navigation、comments、related posts。
- `listing.css`：post card、archive、tags、search、series path。
- `projects.css`：project card、holdings、fear index、charts、tables。
- `responsive.css`：所有 media query，最后导入。

拆分原则：

- 先迁移低风险静态样式，再迁移数据页图表和表格。
- 每次拆一组后运行 `npm run build`，并检查首页、文章页、搜索页、持仓页和恐慌指数页。
- 不新增 CSS 框架，不把组件样式散落到页面内，保持长期维护简单。
