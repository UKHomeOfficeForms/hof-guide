 /* eslint-disable */
import React from 'react';
import Helmet from "react-helmet"
import PropTypes from 'prop-types';
import { StaticQuery, graphql, withPrefix } from 'gatsby';

import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';
import Breadcrumb from './breadcrumb';

import '@progress/kendo-theme-default/dist/all.css';
import '../stylesheets/govuk.scss';
import '../stylesheets/layout-custom.scss';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

const Layout = ({ children, crumbs, title }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Header/>
        <main className="govuk-main-wrapper" id="main-content" role="main">
          <div className="app-pane__toc">
            <div className="toc" data-module="table-of-contents">
              <a href="#" className="toc__close js-toc-close" aria-controls="toc" aria-label="Hide table of contents"></a>
              <nav id="toc" className="js-toc-list toc__list" aria-labelledby="toc-heading">
                <Sidebar className="sidebar-nav" />
              </nav>
            </div>
          </div>
          <div className="main-content"><div className="page-content"><Breadcrumb crumbs={crumbs} title={title}/>{children}<hr/></div>
          <Footer/>
          </div>
        </main>
        <button id="scroll-btn" className="sidebar-btns" title="Scroll to top"></button>
        <Helmet>
          <script src={withPrefix('js/govuk.js')} type="text/javascript" />
        </Helmet>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
