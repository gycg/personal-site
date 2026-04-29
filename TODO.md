# TODO

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
