'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  author: string
}

interface BlogListProps {
  lang: 'zh' | 'en'
}

export const BlogList: React.FC<BlogListProps> = ({ lang }) => {
  const [posts, setPosts] = useState<BlogPost[]>([])

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

  return (
    <div className="mt-12 space-y-10">
      {posts.map((post) => (
        <article key={post.slug} className="relative isolate flex flex-col gap-4 lg:flex-row">
          <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
            {/* Optional: Add image back here if needed, styled appropriately for list view */}
            {/* <img src={post.image || 'default-image.jpg'} alt="" className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover" /> */}
            {/* <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" /> */}
            {/* For now, a placeholder or empty div might be better based on the reference image */}
            <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
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
