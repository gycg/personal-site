import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const postsDir = join(root, 'src/content/posts');
const publicDir = join(root, 'public');
const requiredFields = ['title', 'description', 'pubDate', 'tags', 'draft'];
const errors = [];
const warnings = [];

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

for (const file of readdirSync(postsDir).filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))) {
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

  for (const field of ['cover', 'ogImage']) {
    if (frontmatter.has(field)) checkPublicPath(file, field, frontmatter.get(field));
  }

  const imagePaths = Array.from(source.matchAll(/!\[[^\]]*]\((\/[^)\s]+)\)/g)).map((match) => match[1]);
  for (const imagePath of imagePaths) {
    if (!existsSync(join(publicDir, imagePath))) errors.push(`${file}: markdown image missing ${imagePath}`);
    if (/[A-Z\s()]/.test(imagePath.split('/').pop() ?? '')) {
      warnings.push(`${file}: image filename should be lowercase kebab-case: ${imagePath}`);
    }
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);

if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(`Content check passed with ${warnings.length} warning(s).`);
