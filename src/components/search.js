import React, { Component } from "react"
import { Index } from "elasticlunr"
import { Link } from "gatsby"
import { constructPageUrl } from '../utils/parse-links-to-tree'

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
      <div className='search-bar'>
        <input type="text" value={this.state.query} onChange={this.search} placeholder="Search..."/>
        <ul>
          {this.state.results.map(page => (
            <li key={page.id}>
              <Link to={constructPageUrl(page)}>{page.title}</Link>
            </li>
          ))}
        </ul>
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
