import React, { Component } from "react"
import { Index } from "elasticlunr"
import { navigate, Link } from "gatsby"
import { constructPageUrl, constructDirBreadcrumbs } from '../utils/parse-links-to-tree'

// Search component
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ``,
      results: [],
    }
  }

  render() {
    return (
      <div className="app-site-search" data-module="app-search">
        <Link id="sitemap-header-link" to='/sitemap'>
          Sitemap
        </Link>
        <div className="app-site-search__wrapper govuk-visually-hidden" id="search-bar-wrapper">
          <div id="custom-search-bar">
            <div id="app-site-search__input__status--A" role="status" aria-atomic="true" aria-live="polite"></div>
            <div id="app-site-search__input__status--B" role="status" aria-atomic="true" aria-live="polite"></div>
          </div>

          <input
            aria-expanded="false" aria-controls="custom-search-bar"
            aria-owns="app-site-search__input__listbox"
            aria-autocomplete="both" autoComplete="off"
            className="app-site-search__input app-site-search__input--default"
            id="app-site-search__input"
            name="input-autocomplete"
            placeholder="Search Guide" type="text" role="combobox"
            aria-describedby="app-site-search__input__assistiveHint"
            value={this.state.query} onChange={this.search} />

          <ul className="app-site-search__menu app-site-search__menu--overlay app-site-search__menu--visible"
            id="app-site-search__input__listbox">
            {this.state.results.map((page, index) => (
                <li
                  key={page.id}
                  aria-selected="false"
                  className="app-site-search__option"
                  id={`app-site-search__input__option--${index}`} role="option"
                  tabIndex="-1" aria-posinset={index + 1} aria-setsize={this.state.results.length}
                  onClick={() => { navigate(constructPageUrl(page)) }}
                  onKeyDown={() => { navigate(constructPageUrl(page)) }}>
                    {page.title}
                    <span className="app-site-search--section">{constructDirBreadcrumbs(page.slug)}</span>
                </li>
            ))}
          </ul>
          <span id="app-site-search__input__assistiveHint">When autocomplete results are available use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures.</span>
        </div>
      </div>
    )
  }
  getOrCreateIndex = () =>
    this.index
      ? this.index
      : // Create an elastic lunr index and hydrate with graphql query results
        Index.load(this.props.searchIndex)

  search = evt => {
    const query = evt.target.value
    this.index = this.getOrCreateIndex()
    this.setState({
      query,
      // Query the index with search string to get an [] of IDs
      results: this.index
        .search(query, { expand: true })
        // Map over each ID and return the full document
        .map(({ ref }) => this.index.documentStore.getDoc(ref)),
    })
  }
}
