const path = require('path')
const fs = require('fs')

const getI18nLocaleSlug = (lang, pluginOptions) => {
  let i18nlocaleJSON = JSON.parse(
    fs.readFileSync(`${pluginOptions.i18nLocalesDir}/${lang}.json`)
  )
  return i18nlocaleJSON[pluginOptions.contentPageNamespace].slug
}

const createPagePath = (pluginOptions, lang, slug, isPrivacyPage) => {
  return isPrivacyPage
    ? `/${lang}/${slug}`
    : `/${lang}/${getI18nLocaleSlug(lang, pluginOptions)}/${slug}`
}

exports.onCreateNode = ({ node, actions }, pluginOptions) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const name = path.basename(node.fileAbsolutePath, '.mdx')

    const lang = name.split('.')[1]
    const slug = node.frontmatter.slug

    const pagePath = createPagePath(
      pluginOptions,
      lang,
      slug,
      node.frontmatter.privacy_page
    )

    createNodeField({ node, name: 'lang', value: lang })
    createNodeField({ node, name: 'path', value: pagePath })
  }
}

exports.createPages = async ({ graphql, actions }, pluginOptions) => {
  const { createPage } = actions

  const allMdxQuery = await graphql(`
    {
      allMdx {
        edges {
          node {
            fields {
              lang
            }
            frontmatter {
              title
              slug
              privacy_page
            }
          }
        }
      }
    }
  `)
  if (allMdxQuery.errors) {
    console.error(allMdxQuery.errors)
    return
  }

  allMdxQuery.data.allMdx.edges.forEach(({ node: contentPage }) => {
    const slug = contentPage.frontmatter.slug
    const title = contentPage.frontmatter.title
    const lang = contentPage.fields.lang

    const pagePath = createPagePath(
      pluginOptions,
      lang,
      slug,
      contentPage.frontmatter.privacy_page
    )

    createPage({
      path: pagePath,
      component: pluginOptions.contentTemplate,
      context: {
        lang,
        title,
        isPrivacyPage: contentPage.frontmatter.privacy_page ? true : false,
        isArticlePage: contentPage.frontmatter.privacy_page ? false : true
      }
    })
  })
}
