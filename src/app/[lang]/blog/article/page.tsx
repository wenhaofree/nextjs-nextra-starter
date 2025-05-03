'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { use, useEffect, useState } from 'react'

interface ArticlePageProps {
  params: Promise<{
    lang: string
  }>
}

interface ArticleData {
  id: string
  documentId: string
  slug: string
  title: string
  description: string
  content: string
  date: string
  tags: string[]
  author: string | any // 允许作者字段可能是对象
  image: string | null
}

export default function ArticlePage(props: ArticlePageProps) {
  const params = use(props.params)
  console.log('路由参数:', params)

  const lang = params.lang
  const searchParams = useSearchParams()
  // 确保从URL中获取id参数
  const id = searchParams.get('id')
  console.log('URL查询参数:', { id })

  const [article, setArticle] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      console.warn('没有提供文章ID参数')
      setError(lang === 'zh' ? '未提供文章ID' : 'No article ID provided')
      setLoading(false)
      return
    }

    async function fetchArticle() {
      try {
        console.log(`正在请求文章详情API: /api/blog/${id}?lang=${lang}`)
        const response = await fetch(`/api/blog/${id}?lang=${lang}`)

        if (!response.ok) {
          throw new Error(`获取文章详情失败: ${response.status}`)
        }

        const data = await response.json()
        console.log('API返回数据:', data)

        if (data.error) {
          throw new Error(data.error)
        }

        if (!data.article) {
          throw new Error('API返回的数据不包含文章内容')
        }

        setArticle(data.article)
      }
      catch (err) {
        console.error('获取文章详情失败:', err)
        setError(lang === 'zh' ? '无法加载文章内容，请稍后再试' : 'Unable to load article content, please try again later')
      }
      finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id, lang])

  // 处理作者信息，确保显示为字符串
  const getAuthorName = (author: any): string => {
    if (!author) {
      return '匿名'
    }

    if (typeof author === 'string') {
      return author
    }

    // 如果author是对象，尝试获取name字段
    if (author.name) {
      return author.name
    }

    // 如果是Strapi关系对象
    if (author.data && author.data.attributes) {
      const attrs = author.data.attributes
      return attrs.name || '匿名'
    }

    return '匿名'
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
    catch (error) {
      console.error('日期格式化错误:', error)
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          {lang === 'zh' ? '加载中...' : 'Loading...'}
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          {error || (lang === 'zh' ? '文章不存在' : 'Article not found')}
        </div>
        <div className="text-center mt-4">
          <Link
            href={`/${lang}/blog`}
            className="text-blue-500 hover:text-blue-700"
          >
            {lang === 'zh' ? '返回博客列表' : 'Back to blog list'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/${lang}/blog`}
            className="text-blue-500 hover:text-blue-700"
          >
            ←
            {' '}
            {lang === 'zh' ? '返回博客列表' : 'Back to blog list'}
          </Link>
        </div>

        <article className="prose dark:prose-invert lg:prose-lg max-w-none">
          <h1>{article.title}</h1>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            <span>{getAuthorName(article.author)}</span>
            <span className="mx-2">•</span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4">
            {article.content
              ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                )
              : (
                  <p>{article.description}</p>
                )}
          </div>
        </article>
      </div>
    </div>
  )
}
