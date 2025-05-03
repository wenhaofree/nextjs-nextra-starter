import type Zh from '@/i18n/zh'
import 'server-only'

// We enumerate all dictionaries here for better linting and TypeScript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('@/i18n/en'),
  zh: () => import('@/i18n/zh'),
} as const satisfies Record<string, () => Promise<{ default: typeof Zh }>>

export const getDictionary = async (
  locale: keyof typeof dictionaries,
): Promise<typeof Zh> => {
  try {
    const module = await dictionaries[locale]()
    return module.default
  }
  catch (error) {
    console.error(`Error loading dictionary for locale: ${locale}`, error)
    // 如果加载失败，回退到中文
    const zhModule = await dictionaries.zh()
    return zhModule.default
  }
}

export const getDirection = (locale: keyof typeof dictionaries) => {
  switch (locale) {
    case 'en':
    case 'zh':
    default:
      return 'ltr' as const
  }
}
