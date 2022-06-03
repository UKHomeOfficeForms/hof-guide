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
    <p>
      Add some new pages by following the instructions at the{' '}
      <Link to="/add-new-page">Add New Page</Link> section.
    </p>
    <p>
      To renew the HOF Guide site itself with the latest Gov UK Javascript & Styling.<br></br>

      Use the <Link to="https://x-govuk.github.io/govuk-eleventy-plugin/get-started/">X-GovUK Eleventy Plugin</Link> setup
      to regenerate them and use the 'govuk.css' and 'govuk.js' files to replace the equivalent in this projects under stylesheets
      and components respectively. Also update any urls in the 'govuk.scss' file with relative links directory to the images folder. For example:
      <br></br><br></br>
      <code>url("../fonts/light-94a07e06a1-v2.woff2")</code>
    </p>
  </Layout>
);

export default IndexPage;
