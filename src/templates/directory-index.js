import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Layout from '../components/layout';
import SiteTree from '../utils/generate-site-tree';

const Template = ({ pageContext }) => {
  const crumbs = pageContext.breadcrumb.crumbs;
  const siteTree = new SiteTree(pageContext);
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
    <Layout crumbs={crumbs} title={siteTree.pageTitle}>
      <Helmet title={siteTree.pageTitle} />
      <div>
        <h1>{siteTree.pageTitle}</h1>
        <p>{siteTree.isSitemap ?
          'Below are all directories and pages associated with this guide:' :
          'The following pages refer to this topic:' }
        </p>
        <ul className="directory-index">
          <Menu items={siteTree.generateSiteTreeFromPage(nodes)} />
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
