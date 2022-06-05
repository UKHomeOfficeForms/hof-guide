import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`home office forms`, `form builder`, `hof`, 'govuk form']} />
    <h1>
      Welcome to the HOF Guide{' '}
      <span role="img" aria-label="wave hello">
        👋
      </span>
    </h1>
    <p>This is site hosted by Github Pages for the Home Office Forms Framework.</p>
    <h2>Tips:</h2>
    <ul>
      <li>
        Add some new pages by following the instructions in the <strong>`Add New Page`</strong> page
        <br></br>under the <strong>`Wiki How Tos`</strong> section.
      </li>
    </ul>
  </Layout>
);

export default IndexPage;
