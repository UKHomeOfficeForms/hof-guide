import { StaticQuery, graphql } from 'gatsby';
import React from 'react';
import Search from "./search"

const SearchBar = ({ siteTitle }) => (
  <StaticQuery
    query={graphql`
      query SearchIndexQuery {
        siteSearchIndex {
          index
        }
      }
    `}
    render={data => (
      <Search searchIndex={data.siteSearchIndex.index} />
    )}
  />
);

export default SearchBar;
