import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Strapi API配置
const STRAPI_URL = 'http://127.0.0.1:1337'
const STRAPI_TOKEN = 'c5867192336b232676aa97724d872303cfedf7470831e84642992328635448bbbac18d29acb72ca72acb7c6a3069b47622a562f9d0daa8b3a5c757cea726361b7cd6efd9c62e484f958bb02c4ec728884f3891e9a691a0a248e2c9b7f7ee4479124610372aeb94613c22c38ec3f04d0c9f006814ca2037f18e807199696d6407'

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
    const posts = await getArticlesFromStrapi(lang)
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

async function getArticlesFromStrapi(lang: string) {
  try {
    // 构建API请求URL，可以添加语言筛选参数
    const apiUrl = `${STRAPI_URL}/api/articles?locale=${lang}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `bearer ${STRAPI_TOKEN}`,
        Accept: '*/*',
        'User-Agent': 'NextJS-Client',
      },
    })

    if (!response.ok) {
      console.warn(`Strapi API返回错误状态码: ${response.status}，使用模拟数据`)
      return []
    }

    const data = await response.json()

    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.warn('Strapi API返回的数据为空或格式不正确，使用模拟数据')
      return []
    }

    // 转换Strapi数据结构为应用所需格式
    return data.data.map((article: any) => {
      const defaultImage = `/img/blog/default-card.webp` // 使用默认图片避免404

      return {
        slug: article.slug || `article-${article.id}`,
        title: article.title || '无标题文章',
        description: article.description || '',
        date: article.publishedAt || article.createdAt || new Date().toISOString(),
        tags: article.tags ? article.tags.split(',').map((tag: string) => tag.trim()) : [],
        author: article.author || '匿名',
        // 避免使用可能不存在的图片路径
        image: defaultImage,
        // 添加documentId字段，用于详情页查询
        documentId: article.documentId || `article-${article.id}`,
      }
    }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  catch (error) {
    console.error('从Strapi获取文章失败:', error)
    // 出错时返回模拟数据而不是抛出错误，确保UI不会崩溃
    return []
  }
}
