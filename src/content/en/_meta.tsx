import type { MetaRecord } from 'nextra'
import { TitleBadge } from '@/components/TitleBadge'

export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      timestamp: false,
      layout: 'full',
      toc: false,
    },
  },
  blog: {
    title: 'Blog',
    type: 'page',
    theme: {
      toc: true,
    },
  },
  introduction: {
    type: 'page',
    title: 'Introduction',
    theme: {
      navbar: true,
      toc: false,
    },
  },
  examples: {
    title: 'Examples',
    type: 'page',
  },
  upgrade: {
    title: (
      <span className="flex items-center leading-[1]">
        Changes
        <TitleBadge />
      </span>
    ),
    type: 'page',
  },
} satisfies MetaRecord
