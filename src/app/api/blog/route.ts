import type { NextRequest } from 'next/server'
import * as fs from 'node:fs'
import * as path from 'node:path'
// @ts-ignore
import matter from 'gray-matter'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'en'

  if (lang !== 'en' && lang !== 'zh') {
    return NextResponse.json(
      { error: '不支持的语言' },
      { status: 400 },
    )
  }

  try {
    const posts = getBlogPosts(lang)
    return NextResponse.json({ posts })
  }
  catch (error) {
    console.error('获取博客文章失败:', error)
    return NextResponse.json(
      { error: '获取博客文章失败' },
      { status: 500 },
    )
  }
}

function getBlogPosts(lang: string) {
  const postsDirectory = path.resolve('./src/content', lang, 'blog')
  const fileNames = fs.readdirSync(postsDirectory).filter(fileName =>
    fileName.endsWith('.mdx') && fileName !== 'index.mdx',
  )

  const posts = fileNames.map(fileName => {
    // 移除 .mdx 扩展名获取 slug
    const slug = fileName.replace(/\.mdx$/, '')

    // 读取 MDX 文件内容
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // 使用 gray-matter 解析 frontmatter
    const { data } = matter(fileContents)

    // 确保文章具有所需属性
    return {
      slug: data.slug || slug,
      title: data.title,
      description: data.description || '',
      date: data.date,
      tags: data.tags || [],
      author: data.author || (data.authors ? (Array.isArray(data.authors) ? data.authors[0] : data.authors) : ''),
      image: data.image || null, // 只使用文章中明确指定的图片，否则为null
    }
  })

  // 按日期降序排序（最新的文章在前面）
  return posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}
