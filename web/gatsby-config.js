'use strict'

module.exports = {
  pathPrefix: "/TeleportDresser",
  siteMetadata: {
    title: 'TeleportDresser',
    description: 'A starter kit for TypeScript-based Gatsby projects with sensible defaults.',
    keywords: 'gatsbyjs, gatsby, javascript',
    siteUrl: 'https://takukobayashi.github.io/TeleportDresser/',
    author: {
      name: 'TakuKobayashi',
      url: 'https://twitter.com/taptappun',
      email: 'keep_slimbody@yahoo.co.jp'
    }
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/src/content`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem'
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              quality: 90,
              linkImagesToOriginal: false
            }
          }
        ]
      }
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://gatsby-starter-typescript-plus.netlify.com'
      }
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        features: {
          auth: true,
          database: false,
          firestore: false,
          storage: false,
          messaging: false,
          functions: false,
          performance: false
        },
        credentials: {
          apiKey: "AIzaSyBKq3oBd-m3XVPy2CLAO2fdLvYTXHIGBjw",
          authDomain: "teleportdresser.firebaseapp.com",
          databaseURL: "https://teleportdresser.firebaseio.com",
          projectId: "teleportdresser",
          storageBucket: "teleportdresser.appspot.com",
          messagingSenderId: "984085080699",
          appId: "1:984085080699:web:98e2992bede1cc202d90de"
        },
      }
    }
  ]
}
