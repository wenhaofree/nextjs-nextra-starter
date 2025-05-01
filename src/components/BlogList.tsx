'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  author: string
  image?: string
}

interface BlogListProps {
  lang: 'zh' | 'en'
}

// 模拟获取博客文章数据
// 实际应用中，这可以替换为从API获取数据
const getBlogPosts = (lang: string): BlogPost[] => {
  const posts = [
    {
      slug: 'nextjs-introduction',
      title: lang === 'zh' ? 'Next.js 介绍' : 'Introduction to Next.js',
      description: lang === 'zh'
        ? '全面了解 Next.js 框架的基础特性和优势'
        : 'Learn about the core features and benefits of the Next.js framework',
      date: '2023-12-15',
      tags: ['Next.js', lang === 'zh' ? '前端' : 'Frontend', 'React'],
      author: lang === 'zh' ? '张三' : 'John Doe',
      image: '/img/blog/nextjs-card.webp',
    },
    {
      slug: 'react-hooks',
      title: lang === 'zh' ? 'React Hooks 完全指南' : 'Complete Guide to React Hooks',
      description: lang === 'zh'
        ? '深入探讨 React Hooks 的使用方法和最佳实践'
        : 'Deep dive into React Hooks usage and best practices',
      date: '2024-01-10',
      tags: ['React', 'Hooks', lang === 'zh' ? '前端' : 'Frontend'],
      author: lang === 'zh' ? '李四' : 'Jane Smith',
      image: '/img/blog/react-hooks-card.webp',
    },
    {
      slug: 'tailwind-tricks',
      title: lang === 'zh' ? 'Tailwind CSS 实用技巧' : 'Practical Tricks for Tailwind CSS',
      description: lang === 'zh'
        ? '提高开发效率的 Tailwind CSS 实用技巧和最佳实践'
        : 'Useful Tailwind CSS tricks and best practices to boost your development efficiency',
      date: '2024-02-20',
      tags: ['CSS', 'Tailwind', lang === 'zh' ? '前端' : 'Frontend'],
      author: lang === 'zh' ? '王五' : 'Mike Johnson',
      image: '/img/blog/tailwind-card.webp',
    },
  ]

  // 按日期降序排序（最新的文章在前面）
  return posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

// 格式化日期
const formatDate = (dateString: string, lang: string) => {
  const date = new Date(dateString)

  if (lang === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const BlogList: React.FC<BlogListProps> = ({ lang }) => {
  const router = useRouter()
  const posts = getBlogPosts(lang)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl bg-white dark:bg-gray-800"
        >
          <Link href={`/${lang}/blog/${post.slug}`} className="block overflow-hidden aspect-video relative">
            {post.image
              ? (
                  <div className="relative w-full h-[180px] bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )
              : (
                  <div className="w-full h-[180px] bg-gradient-to-r from-blue-400 to-purple-500"></div>
                )}
          </Link>

          <div className="flex flex-col flex-1 p-6">
            <div className="flex items-center mb-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <span className="font-medium">{post.author}</span>
              </span>
              <span className="mx-2">•</span>
              <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
            </div>

            <Link href={`/${lang}/blog/${post.slug}`} className="block mb-2 no-underline">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                {post.title}
              </h3>
            </Link>

            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {post.description}
            </p>

            <div className="mt-auto flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
