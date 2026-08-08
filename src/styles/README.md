# Stylesheet Maintenance

`index.css` 是当前唯一入口，`BaseLayout.astro` 只导入这个文件。样式按下面顺序加载，避免页面重复引入和覆盖顺序漂移：

- `base.css`：变量、基础字体、header、nav 和 footer。
- `content.css`：文章、归档、专题、侧栏和通用内容布局。
- `home.css`：首页最新研究、专题路线和当前项目。
- `projects.css`：项目卡片、持仓、路线、图表和数据表格。
- `utilities.css`：搜索、返回顶部等低频工具。
- `responsive.css`：原有全站响应式规则，最后导入。

拆分原则：

- 新样式放进所属文件，不在页面内新增大段全局 CSS。
- 每次调整后运行 `npm run build`，并检查首页、文章页、搜索页、持仓页和行业轮动页。
- 不新增 CSS 框架，不把组件样式散落到页面内，保持长期维护简单。
