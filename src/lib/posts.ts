import type { CollectionEntry } from 'astro:content';

export function getPostSlug(post: CollectionEntry<'posts'>) {
  return post.id.replace(/\.(md|mdx)$/, '');
}

export function getPostUrl(post: CollectionEntry<'posts'>) {
  return `/posts/${getPostSlug(post)}/`;
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
  const aNumber = getTitleNumber(a);
  const bNumber = getTitleNumber(b);
  if (aNumber !== null && bNumber !== null && aNumber !== bNumber) {
    return aNumber - bNumber;
  }

  return comparePostsOldest(a, b);
}
