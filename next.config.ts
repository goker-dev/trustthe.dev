import { abstractCategories } from '@/config/navigation'
import type { NextConfig } from 'next'
import { version as VERSION } from './package.json'

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    VERSION,
    PROJECT: process.env.PROJECT,
    DOMAIN: process.env.DOMAIN || process.env.PROJECT || '',
    CHAT_API_KEY: process.env.API_KEY,
    CHAT_API_URL: process.env.API_URL + '/chat',
  },
  images: {
    remotePatterns: [
      {
        hostname: 'kodkafa.s3.eu-central-1.amazonaws.com',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  rewrites: async () => ({
    afterFiles: [
      {
        source: '/humans.txt',
        destination: '/api/humans',
      },
      {
        source: '/.well-known/humans.txt',
        destination: '/api/humans',
      },
    ],
    fallback: [
      ...abstractCategories
        .map(([category, prefix]) => [
          {
            source: `/${category}/:slug`,
            destination: `/${prefix ? prefix + '-' : ''}:slug`,
          },
          {
            source: `/${category}/:slug/:path*`,
            destination: `/${prefix ? prefix + '-' : ''}:slug/:path*`,
          },
        ])
        .flat(),
      // {
      //   source: '/humans.txt',
      //   destination: '/api/humans',
      // },
      // {
      //   source: '/.well-known/humans.txt',
      //   destination: '/api/humans',
      // },
    ],
  }),
  //   afterFiles: [{
  //     source: "/@goker/:path",
  //     destination: "/at_goker/:path",
  //   }],
  //   fallback: [{
  //     source: "/@goker/:path",
  //     destination: "/at_goker/:path",
  //   }]
  // })
  redirects: async () =>
    abstractCategories.map(([category]) => ({
      source: `/${category}-:path`,
      destination: `/${category}/:path`,
      permanent: true,
    })),
}

export default nextConfig
