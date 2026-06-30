export const SITE_TITLE = '长坡厚雪';
export const SITE_DESCRIPTION = '一个程序员的长期研究博客：投资研究、公司分析、LLM 算法工程与 AI 技术观察。';
export const SITE_AUTHOR = '长坡厚雪';
export const SITE_URL = 'https://cphxnotes.com';
export const DEFAULT_OG_IMAGE = '/og-default.svg';

export const MAIN_NAV_ITEMS = [
  { href: '/', label: '首页' },
  { href: '/posts/', label: '文章' },
  { href: '/series/', label: '专题' },
  { href: '/projects/', label: '项目' },
  { href: '/about/', label: '关于' },
];

export const GISCUS_CONFIG = {
  enabled: true,
  repo: 'gycg/personal-site',
  repoId: 'R_kgDOSH0hsw',
  category: 'General',
  categoryId: 'DIC_kwDOSH0hs84C7-iq',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy',
} as const;
