import { useMDXComponents } from '@/mdx-components'
import { generateStaticParamsFor, importPage } from 'nextra/pages'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath, params.lang)
  return metadata
}

type PageProps = Readonly<{
  params: Promise<{
    mdxPath: string[]
    lang: string
  }>
}>
const Wrapper = useMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const params = await props.params
  const result = await importPage(params.mdxPath, params.lang)
  const { default: MDXContent, toc, metadata } = result


  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
      {...props} params={params} />
    </Wrapper>
  );
}
