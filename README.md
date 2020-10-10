# gatsby-plugin-create-i18n-mdx-pages

Creates pages and language specific paths from `.mdx` files and i18n locale files.

The page paths are a combination of the `.mdx` frontmatter slug and the slug from the specified locale name space.

`/${lang}/${lang.namespace.slug}/${frontmatter.slug}`

E.g. `contentPageNamespace` of `articles` for an `.mdx` page in `content/articles/index.en.mdx` will result in a path `domain.com/en/articles/multi-language-article-english`

## Installing

```bash
npm install gatsby-plugin-mdx gatsby-source-filesystem
npm install --dev vanska/gatsby-plugin-create-i18n-mdx-pages
```

## Plugin configuration

```js
plugins: [
  `gatsby-plugin-mdx`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content`,
      name: `content`
    }
  },
  {
    resolve: `gatsby-plugin-create-i18n-mdx-pages`,
    options: {
      i18nLocalesDir: `${__dirname}/locales`,
      contentPageNamespace: 'articles',
      contentTemplate: `${__dirname}/src/templates/Article.js`
    }
  }
]
```

## MDX frontmatter configurations

```md
---
slug: multi-language-article-english
title: 'Multilingual article page title English'
metaTitle: 'Multilingual article page title English'
metaDescription: 'Multilingual article meta description'
date: 2020-04-20
---

# This is the h1 title

Content body goes here.
```

## Omitting the `contentPageNamespace` in paths slug

```md
---
slug: privacy-notice
title: Privacy notice
metaTitle: 'Privacy notice page title'
metaDescription: 'Meta description for privacy notice page'
date: 2020-04-20
privacy_page: true
---

# Privacy notice

This is the page for privacy notices. Only in single language.
```

`privacy_page: false | true`

- Setting to `true` omits the `contentPageNamespace` slug from the generated path.

## Content folder structure

```text
content/
├─ articles/                 # Acts as a landing page, needs to be created separately
│  └─ YYYY-MM-DD-article/    # Specify a date + name for easy sorting
│     ├─ index.en.mdx        # Specify language `en`
│     └─ index.fi.mdx        # Specify language `fi`
└─ privacy-notice            # This page will omit article slug
   ├─ index.en.mdx           # /en/privacy-notice
   └─ web-site-privacy       # Subfolder
      └─ index.en.mdx        # /en/privacy-notice/web-site-privacy
```

## Locales JSON format

File content for `./locales/en.json`.

```js
{
  "articles": {
    "slug": "articles-english",
  }
}
```

## Local package development with yalc

```bash
npm install
npm run yalc-watch
cd ../destination-project
yalc link gatsby-plugin-create-i18n-mdx-pages
```

## Todo

- Get default `contentPageNamespace` from folder name i.e. `articles`. Otherwise use plugin options.
- Change API to a more general one

```js
plugins: [
  `gatsby-plugin-mdx`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content`,
      name: `content`
    }
  },
  {
    resolve: `gatsby-plugin-create-i18n-mdx-pages`,
    options: {
      i18nLocalesDir: `${__dirname}/locales`,
      categories: [
        {
          namespace: `articles`,
          template: `${__dirname}/src/templates/Articles.js`
          childTemplate: `${__dirname}/src/templates/Article.js`
        },
        {
          namespace: `privacy-notice`,
            // needs to match with folder name
          template: `${__dirname}/src/templates/PrivacyNotice.js`
          omitNamespaceInPath: true,
            // `/en/privacy-notice`. Children will omit by default.
          childTemplate: `${__dirname}/src/templates/PrivacyArticle.js`
          children: [
            namespace: `website-privacy`,
              // `/en/privacy-notice/website-privacy`
            template: `${__dirname}/src/templates/WebsitePrivacy.js`
              // overwrite `childTemplate`
          ]
        }
      ]
    }
  }
]
```
