import type { CollectionEntry } from 'astro:content';

export function getPostSlug(post: CollectionEntry<'posts'>) {
  return post.id.replace(/\.(md|mdx)$/, '');
}

export function getPostUrl(post: CollectionEntry<'posts'>) {
  return `/posts/${getPostSlug(post)}/`;
}
