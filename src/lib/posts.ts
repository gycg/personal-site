import type { CollectionEntry } from 'astro:content';

export function getPostSlug(post: CollectionEntry<'posts'>) {
  return post.id.replace(/\.(md|mdx)$/, '');
}

export function getPostUrl(post: CollectionEntry<'posts'>) {
  return `/posts/${getPostSlug(post)}/`;
}

export function getGeneratedOgImageUrl(post: CollectionEntry<'posts'>) {
  return `/og/${getPostSlug(post)}.svg`;
}

export function getPostOgImageUrl(post: CollectionEntry<'posts'>) {
  return post.data.ogImage ?? post.data.cover ?? getGeneratedOgImageUrl(post);
}

export function getPostSeries(post: CollectionEntry<'posts'>) {
  return post.data.series ?? (post.data.tags.includes('从零看懂股票') ? '从零看懂股票' : undefined);
}

export function estimateReadingMinutes(post: CollectionEntry<'posts'>) {
  const body = 'body' in post && typeof post.body === 'string' ? post.body : '';
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[[^\]]*]\([^)]*\)/g, '')
    .replace(/[#>*_`|~-]/g, '');
  const cjkCount = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latinWords = (text.match(/[A-Za-z0-9]+/g) ?? []).length;
  const estimatedWords = cjkCount + latinWords;
  return Math.max(1, Math.ceil(estimatedWords / 450));
}

function getTitleNumber(post: CollectionEntry<'posts'>) {
  const match = post.data.title.match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}

function compareStableId(a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) {
  return getPostSlug(a).localeCompare(getPostSlug(b), 'zh-CN', { numeric: true });
}

export function comparePostsNewest(a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) {
  const dateDiff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  if (dateDiff !== 0) return dateDiff;

  const aNumber = getTitleNumber(a);
  const bNumber = getTitleNumber(b);
  if (aNumber !== null && bNumber !== null && aNumber !== bNumber) {
    return bNumber - aNumber;
  }

  return compareStableId(a, b);
}

export function comparePostsOldest(a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) {
  const dateDiff = a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
  if (dateDiff !== 0) return dateDiff;

  const aNumber = getTitleNumber(a);
  const bNumber = getTitleNumber(b);
  if (aNumber !== null && bNumber !== null && aNumber !== bNumber) {
    return aNumber - bNumber;
  }

  return compareStableId(a, b);
}

export function compareSeriesPosts(a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) {
  if (a.data.seriesOrder && b.data.seriesOrder && a.data.seriesOrder !== b.data.seriesOrder) {
    return a.data.seriesOrder - b.data.seriesOrder;
  }

  const aNumber = getTitleNumber(a);
  const bNumber = getTitleNumber(b);
  if (aNumber !== null && bNumber !== null && aNumber !== bNumber) {
    return aNumber - bNumber;
  }

  return comparePostsOldest(a, b);
}
