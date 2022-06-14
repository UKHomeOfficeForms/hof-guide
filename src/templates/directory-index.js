import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

import Layout from '../components/layout';

const Template = ({ pageContext }) => {
  const crumbs = pageContext.breadcrumb.crumbs;
  const adjustedTitle = pageContext.title.replace(/_/g, ' ');

  return (
    <Layout crumbs={crumbs} title={adjustedTitle}>
      <Helmet title={adjustedTitle} />
      <div>
        <h1>{adjustedTitle}</h1>
        <div dangerouslySetInnerHTML={{ __html: '<></>' }} />
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
