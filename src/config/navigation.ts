export const navigation = [
  {
    text: 'WRITINGS',
    to: '/writings',
  },
  {
    text: 'ECHONEO',
    to: '/echoneo',
  },
  {
    text: 'ART HISTORY',
    to: '/art-history',
  },
  {
    text: 'GOKER',
    to: '/goker',
  },
]

// This is for better url representation for SEO
// Because of / better than - and the backend works with plain slugs
// If the slug is /abstract-1-1, the url will be /abstract/1-1
// Dont forget to check /lib/seo/url-slug.utils.ts, next.config.ts
// We use url rewrite for this and the cannonical should be same as the slug
// if you use a prefix in slugs, should define as [["category", "prefix"]]
export const abstractCategories = [
  ['echoneo', 'echoneo'],
  ['art-history', ''],
  ['writings', ''],
]
export const coverRatios = (slug: string) =>
  ({
    notes: '4/3',
  })[slug] || '16/9'

export const footerLinks = [
  {
    text: 'gokerME',
    to: 'https://goker.me',
  },
  {
    text: 'gokerDEV',
    to: 'https://goker.dev',
  },
  {
    text: 'gokerART',
    to: 'https://goker.art',
  },
  {
    text: 'gokerIN',
    to: 'https://goker.in',
  },
]
