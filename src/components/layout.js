import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';

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
        <div class="govuk-width-container ">
          <main class="govuk-main-wrapper " id="main-content" role="main">
            <div class="govuk-grid-row">
              <div className="container-flex">
                <div class="app-pane__toc">
                  <div class="toc" data-module="table-of-contents">
                    <a href="#" class="toc__close js-toc-close" aria-controls="toc" aria-label="Hide table of contents"></a>
                    <nav id="toc" class="js-toc-list toc__list" aria-labelledby="toc-heading">
                        <Sidebar className="sidebar-flex" />
                    </nav>
                  </div>
                </div>
                <div className="content-flex">
                  {children}
                  <hr />
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer/>
        <button id="scroll-btn" className="sidebar-btns" title="Scroll to top"></button>
        <script src="./govuk.js"></script>
        <script>document.documentElement.classList.remove('no-js')</script>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
