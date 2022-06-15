/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { createFilePath } = require(`gatsby-source-filesystem`);
const { constructPageUrl, generateDirTree } = require('./src/utils/parse-links-to-tree');

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
  const directoryIndexTemplate = require.resolve(`./src/templates/directory-index.js`);

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

    const dirTree = result.data.allMarkdownRemark.edges.map(obj => generateDirTree(obj.node.fields.slug));
    const dirUriArr = _.uniq(dirTree.map(arr => {
      return { path: `/${arr.join('/')}`, title: arr[arr.length - 1] };
    }));

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

    dirUriArr.forEach(obj => {
      createPage({
        path: obj.path,
        component: directoryIndexTemplate,
        context: {
          title: obj.title,
          slug: obj.path,
          tags: []
        }
      });
    });
  });
};
