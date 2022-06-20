import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

import SiteTree from '../utils/generate-site-tree';

import '../stylesheets/sidebar.scss';

const Sidebar = ({ className }) => {
  const siteTree = new SiteTree({ slug: '/sitemap', title: 'Sitemap' });
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

  function Menu({ items, className }) {
    return (
      <ul className={className}>
        {items.map((item, index) => (
          <li key={index} className={(item.type === 'Directory' ? 'nav-directory-container' : 'nav-link-container')}>
            <Link
              className={`${(item.type === 'Directory' ? 'nav nav-directory nav-directory-link' : 'nav nav-link')}`}
              to={item.path}>{item.title}
            </Link>
            {item.type === 'Directory' && <span className="nav nav-directory nav-directory-span govuk-visually-hidden">{item.title}</span>}
            {item.children && <Menu items={item.children} className="nav-directory-subdir" />}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={className}>
      <Link id="homepage" to="/">
        Homepage
      </Link>
      <br></br><br></br>
      <h4
        style={{
          margin: '-0.5rem 0rem 0rem 0.8rem',
          color: '#505a5f',
          fontFamily: '"GDS Transport", arial, sans-serif',
          fontSize: '110%',
          padding: '0.3rem 0 0.3rem 0'
        }}
      >
      Contents:
      </h4>

      <ul className="directory-index">
        <Menu items={siteTree.generateSiteTreeFromPage(nodes)} className="top-nav-directory"/>
      </ul>
    </div>
  );
}

export default Sidebar;
