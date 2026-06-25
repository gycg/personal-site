import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const postsDir = join(root, 'src/content/posts');
const publicDir = join(root, 'public');
const pagesDir = join(root, 'src/pages');
const requiredFields = ['title', 'description', 'pubDate', 'tags', 'draft'];
const errors = [];
const warnings = [];
const postFiles = readdirSync(postsDir).filter((name) => name.endsWith('.md') || name.endsWith('.mdx'));
const postSlugs = new Map();
const knownInternalPaths = new Set(['/', '/posts/', '/projects/', '/series/', '/about/', '/search/', '/rss.xml', '/search.json']);
const seriesOrders = new Map();

function parseFrontmatter(source, file) {
  if (!source.startsWith('---\n')) {
    errors.push(`${file}: missing frontmatter`);
    return new Map();
  }

  const end = source.indexOf('\n---', 4);
  if (end === -1) {
    errors.push(`${file}: unclosed frontmatter`);
    return new Map();
  }

  const map = new Map();
  const body = source.slice(4, end);
  for (const line of body.split('\n')) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (match) map.set(match[1], match[2].trim());
  }
  return map;
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function checkPublicPath(file, field, value) {
  const path = stripQuotes(value);
  if (!path || !path.startsWith('/')) {
    errors.push(`${file}: ${field} must be an absolute public path`);
    return;
  }

  if (!existsSync(join(publicDir, path))) {
    errors.push(`${file}: ${field} points to missing file ${path}`);
  }
}

function walkFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) files.push(...walkFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function pagePathFromFile(file) {
  const relative = file.replace(`${pagesDir}/`, '').replace(/\\/g, '/');
  if (relative.includes('[')) return null;
  if (relative.endsWith('/index.astro')) return `/${relative.replace(/index\.astro$/, '')}`;
  if (relative.endsWith('.astro')) return `/${relative.replace(/\.astro$/, '/')}`;
  if (relative.endsWith('.ts')) return `/${relative.replace(/\.ts$/, '')}`;
  return null;
}

function normalizeInternalLink(link) {
  const path = link.split(/[?#]/)[0];
  if (!path || path.startsWith('/images/') || path.startsWith('/og/')) return null;
  if (path.includes('.')) return path;
  return path.endsWith('/') ? path : `${path}/`;
}

for (const pageFile of walkFiles(pagesDir)) {
  const pagePath = pagePathFromFile(pageFile);
  if (pagePath) knownInternalPaths.add(pagePath);
}

for (const file of postFiles) {
  const slug = file.replace(/\.(md|mdx)$/, '');
  if (postSlugs.has(slug)) errors.push(`${file}: duplicate post slug also used by ${postSlugs.get(slug)}`);
  postSlugs.set(slug, file);
  knownInternalPaths.add(`/posts/${slug}/`);
  knownInternalPaths.add(`/og/${slug}.svg`);
}

for (const file of postFiles) {
  const fullPath = join(postsDir, file);
  const source = readFileSync(fullPath, 'utf8');
  const frontmatter = parseFrontmatter(source, file);

  for (const field of requiredFields) {
    if (!frontmatter.has(field)) errors.push(`${file}: missing required field ${field}`);
  }

  const title = stripQuotes(frontmatter.get('title') ?? '');
  const description = stripQuotes(frontmatter.get('description') ?? '');
  const tags = frontmatter.get('tags') ?? '';
  const draft = frontmatter.get('draft') ?? '';
  const series = stripQuotes(frontmatter.get('series') ?? '');
  const seriesOrder = frontmatter.get('seriesOrder');

  if (title.length < 6) warnings.push(`${file}: title looks too short`);
  if (description.length < 24 || description.length > 130) {
    warnings.push(`${file}: description length should stay roughly 24-130 chars`);
  }
  if (!tags.startsWith('[') || !tags.endsWith(']')) errors.push(`${file}: tags should be an inline array`);
  if (!['true', 'false'].includes(draft)) errors.push(`${file}: draft must be true or false`);
  if (series && !seriesOrder) warnings.push(`${file}: series is set but seriesOrder is missing`);
  if (seriesOrder && (!Number.isInteger(Number(seriesOrder)) || Number(seriesOrder) <= 0)) {
    errors.push(`${file}: seriesOrder must be a positive integer`);
  }
  if (series && seriesOrder) {
    const key = `${series}:${seriesOrder}`;
    if (seriesOrders.has(key)) errors.push(`${file}: duplicate seriesOrder ${seriesOrder} in series ${series}`);
    seriesOrders.set(key, file);
  }

  for (const tag of Array.from(tags.matchAll(/"([^"]+)"/g)).map((match) => match[1])) {
    knownInternalPaths.add(`/tags/${encodeURIComponent(tag)}/`);
  }

  for (const field of ['cover', 'ogImage']) {
    if (frontmatter.has(field)) checkPublicPath(file, field, frontmatter.get(field));
  }

  const markdownTables = Array.from(source.matchAll(/\n\|[^\n]+\|\n\|[\s:|\-]+\|(?:\n\|[^\n]+\|)+/g)).map((match) => match[0]);
  for (const [index, table] of markdownTables.entries()) {
    const pipeCounts = table.split('\n').filter(Boolean).map((row) => (row.match(/\|/g) ?? []).length);
    if (new Set(pipeCounts).size > 1) {
      errors.push(`${file}: table ${index + 1} has inconsistent column counts: ${pipeCounts.join(', ')}`);
    }
  }

  const imagePaths = Array.from(source.matchAll(/!\[[^\]]*]\((\/[^)\s]+)\)/g)).map((match) => match[1]);
  for (const imagePath of imagePaths) {
    if (!existsSync(join(publicDir, imagePath))) errors.push(`${file}: markdown image missing ${imagePath}`);
    if (/[A-Z\s()]/.test(imagePath.split('/').pop() ?? '')) {
      warnings.push(`${file}: image filename should be lowercase kebab-case: ${imagePath}`);
    }
  }

  const internalLinks = Array.from(source.matchAll(/(?<!!)\[[^\]]+]\((\/[^)\s]+)\)/g)).map((match) => match[1]);
  for (const link of internalLinks) {
    const normalizedLink = normalizeInternalLink(link);
    if (normalizedLink && !knownInternalPaths.has(normalizedLink) && !existsSync(join(publicDir, normalizedLink))) {
      errors.push(`${file}: internal link points to missing path ${link}`);
    }
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);

if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(`Content check passed with ${warnings.length} warning(s).`);
