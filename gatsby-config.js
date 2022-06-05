const config = {
  start_url: `/`,
  background_color: `#663399`,
  theme_color: `#663399`,
};

module.exports = {
  pathPrefix: '/home-office-forms-docs',
  siteMetadata: {
    title: `Home Office Forms (HOF) Guide`,
    description: `Markdown based wiki site for the Home Office Forms framework`,
    author: `@cephalization`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `./wiki`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        icon: 'src/images/favicon.ico'
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `hof-docs-starter-default`,
        icon: 'src/images/favicon.png',
        short_name: `starter`,
        start_url: config.start_url,
        background_color: config.background_color,
        theme_color: config.theme_color,
        display: `minimal-ui`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'hof-docs-template',
        icon: 'src/images/favicon.png',
        short_name: 'hof-docs',
        start_url: config.start_url,
        background_color: config.background_color,
        theme_color: config.theme_color,
        display: `standalone`,
      },
    },
    {
     resolve: `gatsby-transformer-remark`,
     options: {
       plugins: [
         {
            resolve: `gatsby-remark-table-of-contents`,
            options: {
              exclude: "Table of Contents",
              tight: false,
              ordered: false,
              fromHeading: 1,
              toHeading: 6,
              className: "table-of-contents"
            },
          },
         `gatsby-remark-autolink-headers`,
         {
           resolve: 'gatsby-remark-code-buttons',
           options: {
             buttonText: `Copy ->`,
             tooltipText: `Copy to clipboard`,
             toasterText: 'Copied!'
           }
         },
        'gatsby-remark-code-titles',
         {
           resolve: `gatsby-remark-prismjs`,
           options: {
             // Class prefix for <pre> tags containing syntax highlighting;
             // defaults to 'language-' (e.g. <pre class="language-js">).
             // If your site loads Prism into the browser at runtime,
             // (e.g. for use with libraries like react-live),
             // you may use this to prevent Prism from re-processing syntax.
             // This is an uncommon use-case though;
             // If you're unsure, it's best to use the default value.
             classPrefix: "language-js",
             // This is used to allow setting a language for inline code
             // (i.e. single backticks) by creating a separator.
             // This separator is a string and will do no white-space
             // stripping.
             // A suggested value for English speakers is the non-ascii
             // character '›'.
             inlineCodeMarker: '›',
             // This lets you set up language aliases.  For example,
             // setting this to '{ sh: "bash" }' will let you use
             // the language "sh" which will highlight using the
             // bash highlighter.
             aliases: '{ sh: "bash" }',
             // This toggles the display of line numbers globally alongside the code.
             // To use it, add the following line in gatsby-browser.js
             // right after importing the prism color scheme:
             //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
             // Defaults to false.
             // If you wish to only show line numbers on certain code blocks,
             // leave false and use the {numberLines: true} syntax below
             showLineNumbers: true,
             // If setting this to true, the parser won't handle and highlight inline
             // code used in markdown i.e. single backtick code like `this`.
             noInlineHighlight: false,
             // This adds a new language definition to Prism or extend an already
             // existing language definition. More details on this option can be
             // found under the header "Add new language definition or extend an
             // existing language" below.
             languageExtensions: [
               {
                 language: "superscript",
                 extend: "javascript",
                 definition: {
                   superscript_types: /(SuperType)/,
                 },
                 insertBefore: {
                   function: {
                     superscript_keywords: /(superif|superelse)/,
                   },
                 },
               },
             ],
             // Customize the prompt used in shell output
             // Values below are default
             prompt: {
               user: "root",
               host: "localhost",
               global: false,
             },
             // By default the HTML entities <>&'" are escaped.
             // Add additional HTML escapes by providing a mapping
             // of HTML entities and their escape value IE: { '}': '&#123;' }
             escapeEntities: {},
           },
         }
       ],
     },
   },
    'gatsby-plugin-offline'
  ],
};
