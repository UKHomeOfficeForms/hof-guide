 /* eslint-disable react/jsx-pascal-case */
import React from 'react';

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
        <p>Add some new pages by following the instructions in the <strong>`Add New Page`</strong> page
        <br></br>under the <strong>`Wiki How Tos`</strong> section.</p>
      </li>
      <li>
        <p>Use this guide as a Chrome app which you can access from your Dock anytime</p>
        <img src="images/homepage/hof-guide-app.png" width="50%" title="HOF Guide App" alt="HOF Guide App"/><br></br>
        <img src="images/homepage/app-in-dock.png" width="40%" title="App in Dock" alt="App in Dock"/>
      </li>
    </ul>
  </Layout>
);

export default IndexPage;
