import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Layout from '../components/layout';

const Template = ({ pageContext }) => {
  function titleCase(str) {
    str = str.toLowerCase();
    str = str.split(' ');

    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

  const crumbs = pageContext.breadcrumb.crumbs;
  const adjustedTitle = pageContext.title.replace(/_/g, ' ');
  const {
    pages: { nodes },
  } = useStaticQuery(graphql`
    {
      pages: allSitePage {
        nodes {
          path
        }
      }
    }
  `);
  const sitePages = nodes.map(node => node.path);
  let relevantUris = sitePages.filter(page => page.startsWith(pageContext.slug));
  relevantUris = relevantUris.filter(page => page !== pageContext.slug);
  relevantUris = relevantUris.map(path => {
    return { path, title: titleCase(path.split('/').reverse()[0].replace(/[-_]/g, ' ').replace(/^([0-9]+)/g, '-')) };
  });
  relevantUris = _.sortBy(relevantUris, 'title');

  return (
    <Layout crumbs={crumbs} title={adjustedTitle}>
      <Helmet title={adjustedTitle} />
      <div>
        <h1>{adjustedTitle}</h1>
        <p>The following pages refer to this topic:</p>
        <ul class="directory-index">
          {relevantUris.map(obj => {
              return (
                <li><Link to={obj.path}>{obj.title}</Link></li>
             )
          })}
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
