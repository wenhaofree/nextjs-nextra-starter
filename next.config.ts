import createWithNextra from 'nextra'

const withNextra = createWithNextra({
  defaultShowCopyCode: true,
  unstable_shouldAddLocaleToLinks: true,
})


/**
 * @type {import("next").NextConfig}
 */
export default withNextra({
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  cleanDistDir: true,
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  async redirects() {
    return [
      {
        source: '/en',
        destination: '/en/docs',
        permanent: true, // Use true for permanent redirect (308)
        locale: false, // Important: prevent Next.js from adding locale prefix again
      },
      {
        source: '/zh',
        destination: '/zh/docs',
        permanent: true,
        locale: false,
      },
      // Add other redirects here if needed
    ]
  },
})
