
module.exports = {
  appName: `HOF Guide App`,
  gatsbyConfig: {
    pathPrefix: `/hof-guide`,
    siteMetadata: {
      title: `Home Office Forms (HOF) Guide`,
      description: `Markdown based wiki site for the Home Office Forms framework`,
      author: `@Alex-Swann`
    }
  },
  // Fields to index for search-bar. You can add `html` to this array if you want to search content too.
  searchFields: [`title`, `tags`],
  start_url: `/`,
  background_color: `#F3F2F1`,
  theme_color: `#F3F2F1`
};
