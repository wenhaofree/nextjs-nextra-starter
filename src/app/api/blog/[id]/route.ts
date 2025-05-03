import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Strapi API配置
const STRAPI_URL = 'http://127.0.0.1:1337'
const STRAPI_TOKEN = 'c5867192336b232676aa97724d872303cfedf7470831e84642992328635448bbbac18d29acb72ca72acb7c6a3069b47622a562f9d0daa8b3a5c757cea726361b7cd6efd9c62e484f958bb02c4ec728884f3891e9a691a0a248e2c9b7f7ee4479124610372aeb94613c22c38ec3f04d0c9f006814ca2037f18e807199696d6407'

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const documentId = params.id
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'en'

  if (lang !== 'en' && lang !== 'zh') {
    return NextResponse.json(
      { error: '不支持的语言' },
      { status: 400 },
    )
  }

  if (!documentId) {
    return NextResponse.json(
      { error: '缺少文章ID' },
      { status: 400 },
    )
  }

  try {
    const article = await getArticleFromStrapi(documentId, lang)
    return NextResponse.json({ article })
  }
  catch (error) {
    console.error('获取博客文章详情失败:', error)
    return NextResponse.json(
      { error: '获取博客文章详情失败' },
      { status: 500 },
    )
  }
}

// 默认空文章数据
const emptyArticle = {
  id: '',
  documentId: '',
  slug: '',
  title: '文章不存在',
  description: '',
  content: '',
  date: new Date().toISOString(),
  tags: [],
  author: '未知',
  image: null,
  category: null,
  blocks: [],
}

// 处理文章内容块，将blocks转换为HTML内容
function processContentBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) {
    return ''
  }

  return blocks.map(block => {
    if (!block) {
      return ''
    }

    // 富文本内容
    if (block.__component === 'shared.rich-text' && block.body) {
      return `<div class="rich-text">${block.body}</div>`
    }

    // 引用内容
    if (block.__component === 'shared.quote' && block.body) {
      return `
        <blockquote class="quote">
          <p>${block.body}</p>
          ${block.title ? `<cite>${block.title}</cite>` : ''}
        </blockquote>
      `
    }

    // 媒体内容（可能需要进一步处理，现在只是占位）
    if (block.__component === 'shared.media') {
      return `<div class="media-placeholder">[媒体内容]</div>`
    }

    // 图片轮播（可能需要进一步处理，现在只是占位）
    if (block.__component === 'shared.slider') {
      return `<div class="slider-placeholder">[图片轮播]</div>`
    }

    return ''
  }).join('\n\n')
}

async function getArticleFromStrapi(documentId: string, lang: string) {
  try {
    // 构建API请求URL，根据documentId获取文章
    const apiUrl = `${STRAPI_URL}/api/articles/${documentId}?locale=${lang}&populate=*`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `bearer ${STRAPI_TOKEN}`,
        Accept: '*/*',
        'User-Agent': 'NextJS-Client',
      },
    })

    if (!response.ok) {
      console.warn(`Strapi API返回错误状态码: ${response.status}，返回空数据`)
      return emptyArticle
    }

    const data = await response.json()

    if (!data || !data.data) {
      console.warn('Strapi API返回的数据为空或格式不正确，返回空数据')
      return emptyArticle
    }

    console.log('API返回的原始数据:', data)

    // 获取文章数据，直接从data.data获取
    const article = data.data

    // 处理图片URL，确保完整路径
    let imageUrl = null
    if (article.cover) {
      // 优先使用中等大小的图片
      if (article.cover.formats && article.cover.formats.medium) {
        imageUrl = `${STRAPI_URL}${article.cover.formats.medium.url}`
      }
      // 如果没有medium格式，使用原始图片
      else if (article.cover.url) {
        imageUrl = `${STRAPI_URL}${article.cover.url}`
      }
    }

    // 处理作者信息
    let authorName = '匿名'
    if (article.author) {
      if (typeof article.author === 'string') {
        authorName = article.author
      }
      else if (article.author.name) {
        authorName = article.author.name
      }
    }

    // 处理文章内容，合并blocks内容
    let content = article.description || ''
    if (article.blocks && Array.isArray(article.blocks)) {
      const processedContent = processContentBlocks(article.blocks)
      if (processedContent) {
        content = processedContent
      }
    }

    // 标签，如果没有，可以使用分类作为标签
    let tags = []
    if (article.tags) {
      // 如果tags是字符串，拆分成数组
      if (typeof article.tags === 'string') {
        tags = article.tags.split(',').map((tag: string) => tag.trim())
      }
      // 如果已经是数组
      else if (Array.isArray(article.tags)) {
        tags = article.tags
      }
    }
    // 如果没有标签但有分类，使用分类作为标签
    else if (article.category && article.category.name) {
      tags = [article.category.name]
    }

    return {
      id: article.id || '',
      documentId: article.documentId || documentId,
      slug: article.slug || `article-${article.id}`,
      title: article.title || '无标题文章',
      description: article.description || '',
      content,
      date: article.publishedAt || article.createdAt || new Date().toISOString(),
      tags,
      author: authorName,
      image: imageUrl,
      category: article.category ? article.category.name : null,
      blocks: article.blocks || [],
    }
  }
  catch (error) {
    console.error('从Strapi获取文章详情失败:', error)
    // 出错时返回空数据而不是抛出错误
    return emptyArticle
  }
}
