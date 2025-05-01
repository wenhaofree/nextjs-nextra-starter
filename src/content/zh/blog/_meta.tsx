import type { MetaRecord } from 'nextra'

export default {
  index: {
    title: '全部文章',
    display: 'normal',
    theme: {
      layout: 'full',
      timestamp: false,
      breadcrumb: false,
    },
  },
  'nextjs-introduction': {
    title: 'Next.js 介绍',
    theme: {
      toc: true,
      timestamp: true,
      typesetting: 'article',
    },
  },
  'react-hooks': {
    title: 'React Hooks 完全指南',
    theme: {
      toc: true,
      timestamp: true,
      typesetting: 'article',
    },
  },
  'tailwind-tricks': {
    title: 'Tailwind CSS 实用技巧',
    theme: {
      toc: true,
      timestamp: true,
      typesetting: 'article',
    },
  },
} satisfies MetaRecord
