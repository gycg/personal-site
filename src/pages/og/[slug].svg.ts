import { getCollection } from 'astro:content';
import { SITE_AUTHOR, SITE_TITLE } from '../../consts';
import { estimateReadingMinutes, getPostSeries, getPostSlug } from '../../lib/posts';

function escapeSvg(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function wrapText(value: string, maxChars: number, maxLines: number) {
  const chars = Array.from(value);
  const lines: string[] = [];
  let line = '';

  for (const char of chars) {
    if (line.length >= maxChars) {
      lines.push(line);
      line = '';
    }
    line += char;
    if (lines.length === maxLines) break;
  }

  if (line && lines.length < maxLines) lines.push(line);
  if (chars.length > lines.join('').length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].slice(0, -1)}…`;
  }

  return lines;
}

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: getPostSlug(post) },
    props: { post },
  }));
}

export async function GET({ props }: { props: { post: Awaited<ReturnType<typeof getCollection<'posts'>>>[number] } }) {
  const { post } = props;
  const titleLines = wrapText(post.data.title, 18, 3);
  const descriptionLines = wrapText(post.data.description, 34, 2);
  const series = getPostSeries(post) ?? post.data.tags[0] ?? '研究笔记';
  const readingMinutes = estimateReadingMinutes(post);
  const titleSvg = titleLines
    .map((line, index) => `<text x="88" y="${220 + index * 82}" class="title">${escapeSvg(line)}</text>`)
    .join('');
  const descriptionSvg = descriptionLines
    .map((line, index) => `<text x="92" y="${505 + index * 40}" class="desc">${escapeSvg(line)}</text>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbfdf8"/>
      <stop offset="0.58" stop-color="#edf5ec"/>
      <stop offset="1" stop-color="#f8f1df"/>
    </linearGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="#d9e4d5" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#paper)"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.55"/>
  <rect x="58" y="54" width="1084" height="522" rx="18" fill="#fffffb" opacity="0.72" stroke="#b8cbb3"/>
  <path d="M88 132H330" stroke="#315f46" stroke-width="4"/>
  <circle cx="1088" cy="116" r="12" fill="#a67123"/>
  <text x="88" y="118" class="eyebrow">${escapeSvg(series)} · ${readingMinutes} 分钟读完</text>
  ${titleSvg}
  ${descriptionSvg}
  <text x="92" y="566" class="site">${escapeSvg(SITE_TITLE)} / ${escapeSvg(SITE_AUTHOR)}</text>
  <style>
    text { font-family: "Noto Serif SC", "Songti SC", "Microsoft YaHei", serif; fill: #20362b; }
    .eyebrow { font: 700 28px "Noto Sans SC", "Microsoft YaHei", sans-serif; letter-spacing: 3px; fill: #315f46; }
    .title { font-size: 64px; font-weight: 700; }
    .desc { font: 400 28px "Noto Sans SC", "Microsoft YaHei", sans-serif; fill: #607067; }
    .site { font: 600 24px "Noto Sans SC", "Microsoft YaHei", sans-serif; fill: #315f46; }
  </style>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
