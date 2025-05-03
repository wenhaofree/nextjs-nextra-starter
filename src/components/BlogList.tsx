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
  image: string
}

interface BlogListProps {
  lang: 'zh' | 'en'
}

// 添加cn工具函数用于合并className
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const BlogList: React.FC<BlogListProps> = ({ lang }) => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  // 跟踪每个图片的加载状态
  const [imageStates, setImageStates] = useState<Record<string, { loaded: boolean, error: boolean }>>({})

  useEffect(() => {
    async function fetchBlogPosts() {
      const response = await fetch(`/api/blog?lang=${lang}`)
      const data = await response.json()
      setPosts(data.posts)
    }

    fetchBlogPosts()
  }, [lang])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // 处理图片加载完成
  const handleImageLoad = (slug: string) => {
    setImageStates(prev => ({
      ...prev,
      [slug]: { loaded: true, error: false },
    }))
  }

  // 处理图片加载错误
  const handleImageError = (slug: string) => {
    setImageStates(prev => ({
      ...prev,
      [slug]: { loaded: false, error: true },
    }))
  }

  return (
    <div className="mt-12 space-y-10">
      {posts.map((post) => (
        <article key={post.slug} className="relative isolate flex flex-col gap-4 lg:flex-row">
          <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0 overflow-hidden rounded-2xl">
            {/* 背景渐变效果 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>

            {/* 图片加载占位符 - 只在没有图片时显示 */}
            {!post.image && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center w-full h-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* 使用重复的wenhaofree文字作为背景 */}
                    <div className="absolute inset-0 grid place-items-center overflow-hidden">
                      <div className="transform -rotate-12">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="flex gap-2 opacity-10">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <span key={j} className="text-lg font-bold text-primary whitespace-nowrap dark:text-blue-300 text-blue-600">
                                wenhaofree.com
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 中央突出的wenhaofree.com标志 */}
                    {/* <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg z-10 border border-white/10">
                      <span className="text-xl font-bold text-white">WENHAOFREE</span>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {/* 博客图片 */}
            {post.image && (
              <div className="relative w-full h-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={80}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225' width='400' height='225'%3E%3Crect width='400' height='225' fill='%23f5f5f5'/%3E%3C/svg%3E"
                  className="object-cover"
                  style={{ objectFit: 'cover' }}
                  onError={() => handleImageError(post.slug)}
                />
              </div>
            )}

            {/* 没有图片或图片加载错误时显示纯色背景 */}
            {(!post.image || imageStates[post.slug]?.error) && (
              <div className="absolute inset-0 rounded-2xl bg-gray-100 dark:bg-gray-800"></div>
            )}

            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 z-20" />
          </div>
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
                <Link href={`/${lang}/blog/${post.slug}`} className="no-underline">
                  <span className="absolute inset-0" />
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-2">
                {post.description}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="relative z-10 rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
