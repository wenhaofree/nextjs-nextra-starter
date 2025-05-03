'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  author: string
  image: string | null
  documentId?: string
}

interface BlogListProps {
  lang: 'zh' | 'en'
}

export const BlogList: React.FC<BlogListProps> = ({ lang }) => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogPosts() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/blog?lang=${lang}`)

        if (!response.ok) {
          throw new Error(`获取博客列表失败: ${response.status}`)
        }

        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }

        // 确保每篇文章都有documentId
        const postsWithId = (data.posts || []).map((post: BlogPost) => {
          if (!post.documentId) {
            console.warn(`文章 "${post.title}" 缺少documentId，使用slug代替`)
            return { ...post, documentId: post.slug || `post-${Math.random().toString(36).substring(2, 9)}` }
          }
          return post
        })

        setPosts(postsWithId)
      }
      catch (err) {
        console.error('获取博客文章时出错:', err)
        setError(lang === 'zh' ? '无法加载博客文章，请稍后再试' : 'Unable to load blog posts, please try again later')
      }
      finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [lang])

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

  // 加载中状态
  if (loading) {
    return <div className="mt-12 text-center">{lang === 'zh' ? '加载中...' : 'Loading...'}</div>
  }

  // 错误状态
  if (error) {
    return <div className="mt-12 text-center text-red-500">{error}</div>
  }

  // 空数据状态
  if (!posts || posts.length === 0) {
    return (
      <div className="mt-12 text-center">
        {lang === 'zh' ? '暂无博客文章' : 'No blog posts available'}
      </div>
    )
  }

  return (
    <div className="mt-12 space-y-10">
      {posts.map((post) => (
        <article key={post.slug} className="relative isolate flex flex-col gap-4 lg:flex-row">
          {/* <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Image
                src="/img/blog/default-card.webp"
                alt="默认背景"
                fill
                className="object-cover"
              />
            </div>
          </div> */}
          <div className="flex-1">
            <div className="flex items-center gap-x-4 text-xs mb-2">
              <span className="text-gray-500 dark:text-gray-400">
                {post.author}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                •
              </span>
              <time dateTime={post.date} className="text-gray-500 dark:text-gray-400">
                {formatDate(post.date)}
              </time>
            </div>
            <div className="group relative">
              <h3 className="mt-1 text-lg font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <Link
                  href={`/${lang}/blog/article?id=${post.documentId}`}
                  className="no-underline"
                >
                  <span className="absolute inset-0" />
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-2">
                {post.description}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags && post.tags.length > 0
                ? (
                    post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="relative z-10 rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      >
                        {tag}
                      </span>
                    ))
                  )
                : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
