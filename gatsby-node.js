/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { createFilePath } = require(`gatsby-source-filesystem`);
const { constructPageUrl } = require('./src/utils/parse-links-to-tree');

exports.onPreBootstrap = ({ store }) => {
  const { program } = store.getState();
  const dir = `${program.directory}/wiki`;

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const wikiPostTemplate = require.resolve(`./src/templates/wiki-post.js`);

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              path
              tags
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const mergedFields = Object.assign({}, node.fields, node.frontmatter);
      
      createPage({
        path: constructPageUrl(mergedFields),
        component: wikiPostTemplate,
        context: {
          title: node.frontmatter.title,
          slug: node.fields.slug,
          tags: node.frontmatter.tags
        }, // additional data can be passed via context
      });
    });
  });
};
