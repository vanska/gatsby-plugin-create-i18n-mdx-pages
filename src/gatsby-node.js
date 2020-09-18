const path = require('path')
const fs = require('fs')
const {
  // localizedSlug,
  // findKey,
  // removeTrailingSlash
} = require(`./utils/gatsby-node-helpers`)

// const siteConfigJsonPath = path.resolve("./config/site-config.json")
// const siteConfig = JSON.parse(fs.readFileSync(siteConfigJsonPath))

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const name = path.basename(node.fileAbsolutePath, '.mdx')

    const lang = name.split('.')[1]
    createNodeField({ node, name: 'lang', value: lang })
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

    const i18nLocale = JSON.parse(
      fs.readFileSync(`${pluginOptions.i18nLocalesDir}/${lang}.json`),
    )

    const pagePath = contentPage.frontmatter.privacy_page
      ? `/${lang}/${slug}`
      : `/${lang}/${
          i18nLocale[pluginOptions.contentPageNamespace].slug
        }/${slug}`

    createPage({
      path: pagePath,
      component: pluginOptions.contentTemplate,
      context: {
        lang,
        title,
      },
    })
  })
}
