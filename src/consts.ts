export const SITE_TITLE = '长坡厚雪';
export const SITE_DESCRIPTION = '一个大厂程序员的长期投资研究笔记：股票、公司研究、AI 投研与财务自由。';
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
  enabled: false,
  repo: '',
  repoId: '',
  category: '',
  categoryId: '',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: 'light',
  lang: 'zh-CN',
  loading: 'lazy',
} as const;
