import { getCollection } from 'astro:content';
import { comparePostsNewest, getPostUrl } from '../lib/posts';

export async function GET() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort(comparePostsNewest)
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      url: getPostUrl(post),
      pubDate: post.data.pubDate.toISOString(),
    }));

  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
