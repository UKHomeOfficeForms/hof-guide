import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import { parseLinksToTree } from '../utils/parse-links-to-tree';

import { NavTree } from './navtree';
import '../stylesheets/sidebar.scss';

const Sidebar = ({ className }) => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark(sort: { fields: [frontmatter___path, fields___slug], order: ASC }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                path
                title
              }
            }
          }
        }
      }
    `}
    render={({ allMarkdownRemark: { edges: pages } }) => (
      <NavTree tree={parseLinksToTree(pages)} className={className} />
    )}
  />
);

export default Sidebar;
