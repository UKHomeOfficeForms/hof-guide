import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

import Layout from '../components/layout';

const Template = ({
  pageContext: {
    breadcrumb: { crumbs }
  },
  data
}) => {
  const { markdownRemark: post } = data;
  return (
    <Layout crumbs={crumbs} title={post.frontmatter.title}>
      <Helmet title={post.frontmatter.title} />
      <div>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query BlogPostByTitle($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        path
        title
        tags
      }
    }
  }
`;

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
