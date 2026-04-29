<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/rss/channel">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title><xsl:value-of select="title" /> RSS</title>
        <style>
          :root {
            color-scheme: light;
            --bg: #eef4ef;
            --surface: #fbfcfa;
            --surface-soft: #f4f8f4;
            --text: #25352c;
            --muted: #607067;
            --border: #c9d5ca;
            --accent: #2f654c;
            --mark: #9f6418;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            background:
              linear-gradient(90deg, rgba(37, 53, 44, 0.045) 1px, transparent 1px) 0 0 / 72px 72px,
              linear-gradient(0deg, rgba(37, 53, 44, 0.035) 1px, transparent 1px) 0 0 / 72px 72px,
              linear-gradient(180deg, #f7faf7, var(--bg));
            color: var(--text);
            font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
            line-height: 1.75;
          }

          a {
            color: var(--accent);
            text-decoration-thickness: 1px;
            text-underline-offset: 0.18em;
          }

          .shell {
            width: min(100% - 32px, 960px);
            margin-inline: auto;
          }

          header {
            padding: 56px 0 34px;
            border-bottom: 1px solid var(--border);
          }

          .eyebrow {
            margin: 0 0 10px;
            color: var(--accent);
            font-size: 0.82rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0 0 14px;
            max-width: 12em;
            font-family: "Noto Serif SC", "Songti SC", serif;
            font-size: clamp(2.35rem, 7vw, 4.25rem);
            line-height: 1.08;
          }

          .lead {
            max-width: 680px;
            margin: 0;
            color: var(--muted);
            font-size: 1.05rem;
          }

          .subscribe {
            display: grid;
            gap: 10px;
            margin-top: 24px;
            padding: 18px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: rgba(251, 252, 250, 0.75);
          }

          .subscribe strong {
            font-size: 0.92rem;
          }

          .feed-url {
            overflow-wrap: anywhere;
            margin: 0;
            padding: 12px 14px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: var(--surface);
            color: var(--muted);
            font-family: "Fira Code", "SFMono-Regular", monospace;
            font-size: 0.9rem;
          }

          main {
            padding: 34px 0 72px;
          }

          .post-list {
            display: grid;
            gap: 12px;
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .post-card {
            border-top: 1px solid var(--border);
            border-radius: 8px;
            background: rgba(251, 252, 250, 0.68);
            padding: 22px;
          }

          .post-card h2 {
            margin: 0 0 8px;
            font-family: "Noto Serif SC", "Songti SC", serif;
            font-size: 1.38rem;
            line-height: 1.25;
          }

          .post-card h2 a {
            color: var(--text);
            text-decoration: none;
          }

          .post-card h2 a:hover {
            color: var(--accent);
          }

          .meta {
            margin: 0 0 8px;
            color: var(--muted);
            font-size: 0.82rem;
          }

          .post-card p {
            margin: 0;
            color: var(--muted);
          }

          footer {
            padding: 28px 0;
            border-top: 1px solid var(--border);
            color: var(--muted);
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <header>
          <div class="shell">
            <p class="eyebrow">RSS Feed</p>
            <h1><xsl:value-of select="title" /></h1>
            <p class="lead"><xsl:value-of select="description" /></p>
            <div class="subscribe">
              <strong>这是 RSS 订阅源</strong>
              <p class="feed-url"><xsl:value-of select="atom:link/@href" /></p>
              <a>
                <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                返回网站首页
              </a>
            </div>
          </div>
        </header>

        <main class="shell">
          <ul class="post-list">
            <xsl:for-each select="item">
              <li class="post-card">
                <p class="meta"><xsl:value-of select="pubDate" /></p>
                <h2>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                    <xsl:value-of select="title" />
                  </a>
                </h2>
                <p><xsl:value-of select="description" /></p>
              </li>
            </xsl:for-each>
          </ul>
        </main>

        <footer>
          <div class="shell">把订阅地址复制到 RSS 阅读器即可持续接收更新。</div>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
