import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const imageRoot = join(root, 'public/images/posts');
const postsRoot = join(root, 'src/content/posts');
const deleteSource = process.argv.includes('--delete-source');
const supportedExtensions = new Set(['.png', '.jpg', '.jpeg']);

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry);
    if ((await stat(path)).isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const sourceFiles = (await walk(imageRoot)).filter((path) => supportedExtensions.has(extname(path).toLowerCase()));
const replacements = new Map();
let sourceBytes = 0;
let outputBytes = 0;

for (const sourcePath of sourceFiles) {
  const extension = extname(sourcePath);
  const outputPath = `${sourcePath.slice(0, -extension.length)}.webp`;
  const sourceRelative = sourcePath.slice(join(root, 'public').length).replaceAll('\\', '/');
  const outputRelative = outputPath.slice(join(root, 'public').length).replaceAll('\\', '/');
  const sourceSize = (await stat(sourcePath)).size;

  await sharp(sourcePath)
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  sourceBytes += sourceSize;
  outputBytes += (await stat(outputPath)).size;
  replacements.set(sourceRelative, outputRelative);
}

for (const file of await readdir(postsRoot)) {
  if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
  const path = join(postsRoot, file);
  const source = await readFile(path, 'utf8');
  let nextSource = source;
  for (const [from, to] of replacements) nextSource = nextSource.replaceAll(from, to);
  if (nextSource !== source) await writeFile(path, nextSource, 'utf8');
}

if (deleteSource) {
  for (const sourcePath of sourceFiles) await rm(sourcePath);
}

const savedPercent = sourceBytes ? Math.round((1 - outputBytes / sourceBytes) * 100) : 0;
console.log(`优化 ${sourceFiles.length} 张图片：${(sourceBytes / 1024 / 1024).toFixed(1)} MB → ${(outputBytes / 1024 / 1024).toFixed(1)} MB，减少 ${savedPercent}%`);
console.log(deleteSource ? '原始图片已在转换成功后删除。' : '原始图片保留；确认后可增加 --delete-source。');
