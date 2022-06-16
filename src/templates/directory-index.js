/* eslint-disable no-loop-func */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Layout from '../components/layout';
import { generateDirTree, formatTitle } from '../utils/parse-links-to-tree';

const Template = ({ pageContext }) => {
  const crumbs = pageContext.breadcrumb.crumbs;
  const adjustedTitle = formatTitle(pageContext.title);
  // use graphql to get all page links from site
  const { pages: { nodes } } = useStaticQuery(graphql`
    {
      pages: allSitePage {
        nodes {
          path
        }
      }
    }
  `);
  // parse through node paths in response from graphql
  let relevantUris = nodes
                      .map(node => node.path)
                      // filter page paths associated with current page onwards
                      .filter(path => path.startsWith(pageContext.slug))
                      // generate brearcrumb directory tree array and return props
                      .map(path => {
                        let directoryTree = generateDirTree(`${path}/`);
                        const title = path.split('/').reverse()[0];

                        return {
                          path,
                          title,
                          directoryTree,
                          isDirectory: false
                        };
                      });
  // generate array of all subdirectories of current page
  const allSubDirs = _.uniq(relevantUris.map(uri => uri.directoryTree.join('/'))).sort();
  // establish if end page route is a directory and update obj props if so
  relevantUris = relevantUris.map(obj => {
    const isEndDirectory = allSubDirs.filter(dir => {
      return dir.endsWith(`/${obj.title}`) || dir === obj.title;
    }).length;

    if (isEndDirectory) {
      obj.directoryTree.push(obj.title);
      obj.isDirectory = true;
    }
    return obj;
  });
  // sort by directory tree array and then by url path
  relevantUris = _.sortBy(relevantUris, ['directoryTree', 'path']);

  function treeData(data) {
    let root = { children: [] }; // create origin

    for (var obj of data) { // loop items in the data
      obj.type = 'Page'; // add a property to suit your output
      let tree = root; // start at root every object

      for (var subDir of obj.directoryTree) { // loop over items in subDir
        let branch = tree.children.find(k => k.title === formatTitle(subDir)); // look for branch

        if (!branch) { // if no branch, create one
          branch = {
            title: formatTitle(subDir),
            type: 'Directory',
            path: obj.path.substring(0, obj.path.indexOf(subDir)) + subDir,
            children: []
          };
          tree.children.push(branch); // push this into children of current level
        }
        tree = branch; // set tree to branch before processing next item in subDir
      }
      if (!obj.isDirectory) {
        obj.title = formatTitle(obj.title);
        tree.children.push(obj); // add the item to the hierarchy after subDir is exhausted
      }
    }
    return root.children; // return children of the root to suit your output
  }
  // loop through all page routes to format a navigation tree
  let navTree = treeData(relevantUris); // clone array to not mutate original

  function Menu({ items }) {
    return (
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link
              className={(item.type === 'Directory' ? 'nav nav-directory' : 'nav nav-link')}
              to={item.path}>{item.title}
            </Link>
            {item.children && <Menu items={item.children} />}
          </li>
        ))}
      </ul>
    );
  }
  // recursively format html based on navigation tree through all nested children
  return (
    <Layout crumbs={crumbs} title={adjustedTitle}>
      <Helmet title={adjustedTitle} />
      <div>
        <h1>{adjustedTitle}</h1>
        <p>The following pages refer to this topic:</p>
        <ul className="directory-index">
          <Menu items={navTree} />
        </ul>
      </div>
    </Layout>
  );
}

export default Template;

Template.propTypes = {
  pageContext: PropTypes.shape({
    breadcrumb: PropTypes.shape({
      crumbs: PropTypes.arrayOf(
        PropTypes.shape({
          location: PropTypes.shape(),
          pathname: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  }).isRequired
};
