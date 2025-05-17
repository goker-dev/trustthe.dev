const DOMAIN = process.env.DOMAIN || 'goker.dev'
const BASE_URL = `https://${DOMAIN}`
const SITE_NAME = 'gokerDEV'
const CONTACT_EMAIL = 'contact[at]goker.me'
const DEFAULT_LOCALE = 'en_US'
const DEFAULT_DESCRIPTION =
  "I'm oil-free piece of fried eggs, determined to cling on the floor and completely contrary from the whole..."
const DEFAULT_OG_IMAGE = '/default.png'
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const DEFAULT_SCHEMA_IMAGE = '/default.png'
const AUTHOR_NAME = 'goker'
const AUTHOR_URL = 'https://goker.dev/goker'
const TWITTER_HANDLE = '@gokerDEV'
const TWITTER_CARD_TYPE = 'summary_large_image'
const ORGANIZATION_NAME = 'goker'
const ORGANIZATION_URL = 'https://goker.dev'

// Trust the developers
const TECH_STACK = 'Next.js 15, React 19, Tailwind 4, Shadcn UI, KODKAFA API'
const TECH_TOOLS = 'Cursor, WebStorm, Github, Vercel'
const BUY_ME_A_COFFEE = 'https://www.buymeacoffee.com/goker'

const TTD = {
  version: String(process.env.VERSION),
  commitHash: process.env.VERCEL_GIT_COMMIT_SHA || '1234567890',
  commitAuthorName: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || 'goker',
  commitAuthorLogin: process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || 'goker-dev',
  commitMessage:
    process.env.VERCEL_GIT_COMMIT_MESSAGE ||
    'Enhance Version Component: Add tooltip tech stack display',
  commitRef: process.env.VERCEL_GIT_COMMIT_REF || 'main',
  repoSlug: process.env.VERCEL_GIT_REPO_SLUG || 'kodkafa-app-template',
  repoOwner: process.env.VERCEL_GIT_REPO_OWNER || 'kodkafa',
  provider:
    typeof process.env.VERCEL_GIT_PROVIDER === 'string'
      ? process.env.VERCEL_GIT_PROVIDER
      : 'github',
}
// Humans.txt
const HUMANSTXT = `
/* TEAM */
This is a one-man-army project.
Dev, designer, debugger, deployer: ${AUTHOR_NAME}
Site: ${AUTHOR_URL}

/* THANKS */
Big thanks to AI assistants — more stable than junior devs after their third espresso.
And to the open web: still weird, still wonderful. Never change.

/* SITE */
Stack: ${TECH_STACK}
Tools: ${TECH_TOOLS}
Backend: KODKAFA API — https://kodkafa.com
PS:This is a template which is  i'm working on and it will be open-sourced soon.

/* INSPIRATION */
Built to learn, share, and keep the digital garden growing.
Fueled by curiosity, caffeine, and a low tolerance for bad UI.

/* ROADMAP */
- Auth system (because not everything is for everyone)
- Private content access (sssh...)
- Shopping (code now, buy later)
- Direct chat (talk to the dev, maybe even get a reply)
✓ Dark mode - already redefined. Balanced, beautiful, contrast-checked.
  → https://goker.me/balanced-theme-system
- Chaos mode (??? no one asked, so we built it)

/* CONTACT */
Want to contribute, collaborate, or correct a comma?
Ping me: ${CONTACT_EMAIL}

/* EASTER EGG */
You found the humans.txt - you're probably my kind of people.
Consider this a digital nod of respect.

/* SUPPORT */
Like the project? Fuel the dev: ${BUY_ME_A_COFFEE}
`

export {
  AUTHOR_NAME,
  AUTHOR_URL,
  BASE_URL,
  BUY_ME_A_COFFEE,
  CONTACT_EMAIL,
  DEFAULT_DESCRIPTION,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_SCHEMA_IMAGE,
  DOMAIN,
  HUMANSTXT,
  OG_HEIGHT,
  OG_WIDTH,
  ORGANIZATION_NAME,
  ORGANIZATION_URL,
  SITE_NAME,
  TECH_STACK,
  TTD,
  TWITTER_CARD_TYPE,
  TWITTER_HANDLE,
}
