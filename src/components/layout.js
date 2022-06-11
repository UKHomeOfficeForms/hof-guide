 /* eslint-disable */
import React from 'react';
import Helmet from "react-helmet"
import PropTypes from 'prop-types';
import { StaticQuery, graphql, withPrefix } from 'gatsby';

import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';
import SearchBar from './search-bar';

import '@progress/kendo-theme-default/dist/all.css';
import '../stylesheets/govuk.scss';
import '../stylesheets/layout-custom.scss';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

const Layout = ({ children }) => (
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
        <div className="govuk-width-container">
          <main className="govuk-main-wrapper" id="main-content" role="main">
            <div className="govuk-grid-row">
              <div className="container-flex">
                <div className="column">
                  <div className="app-pane__toc">
                    <div className="toc" data-module="table-of-contents">
                      <a href="#" className="toc__close js-toc-close" aria-controls="toc" aria-label="Hide table of contents"></a>
                      <nav id="toc" className="js-toc-list toc__list" aria-labelledby="toc-heading">
                        <Sidebar className="sidebar-nav" />
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="column main-content">{children}<hr/></div>
                <div className="column"><SearchBar/></div>
              </div>
            </div>
          </main>
        </div>
                <Footer/>
        <button id="scroll-btn" className="sidebar-btns" title="Scroll to top"></button>
        <Helmet>
            <script src={withPrefix('js/govuk.js')} type="text/javascript" />
        </Helmet>
        <script>document.documentElement.classList.remove('no-js')</script>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
