# gatsby-plugin-create-i18n-mdx-pages

Creates pages and language spesific paths from `.mdx` files and i18n locale files.

The page paths are a combination of the `.mdx` frontmatter slug and the slug from the spesified locale namespace.

A `contentPageNamespace` of `articles` will result in a path `domain.com/articles/multi-language-article-english`.

## Installing

```bash
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
date: 2019-04-02
---

# This is the h1 title

Content body goes here.
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
