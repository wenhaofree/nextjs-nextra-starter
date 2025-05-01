import type { MetaRecord } from 'nextra'

export default {
  index: {
    title: 'All Posts',
    display: 'normal',
    theme: {
      layout: 'full',
      timestamp: false,
      breadcrumb: false,
    },
  },
  'nextjs-introduction': {
    title: 'Introduction to Next.js',
    theme: {
      toc: true,
      timestamp: true,
      typesetting: 'article',
    },
  },
  'react-hooks': {
    title: 'Complete Guide to React Hooks',
    theme: {
      toc: true,
      timestamp: true,
      typesetting: 'article',
    },
  },
  'tailwind-tricks': {
    title: 'Practical Tricks for Tailwind CSS',
    theme: {
      toc: true,
      timestamp: true,
      typesetting: 'article',
    },
  },
} satisfies MetaRecord
