import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

class Filters extends Component {
  static propTypes = {
    //repos: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
  }

  updateFilter = (id, value) => {
    const { query } = this.props
    const newValue = value === true
      ? null
      : value === false
        ? undefined
        : value
    this.props.history.push(`?${queryString.stringify(Object.assign({}, query, { [id]: newValue }))}`)
  }

  render() {
    const { query, repos } = this.props
    return (
      <div>
        <div>
          <label htmlFor="sort">Sort:</label>
          <select id="sort" value={query.sort} onChange={e => this.updateFilter('sort', e.target.value)}>
            <option value="name">Name</option>
            <option value="stars">Stars</option>
            <option value="issues">Issues</option>
            <option value="updated">Updated</option>
          </select>
          <label htmlFor="order">Sort order:</label>
          <select id="order" value={query.order} onChange={e => this.updateFilter('order', e.target.value)}>
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
          <label htmlFor="language">Language:</label>
          <select id="language" value={query.language} onChange={e => this.updateFilter('language', e.target.value)} >
            <option value="all">All</option>
          </select>
          <label htmlFor="type">Type:</label>
          <select id="type" value={query.type} onChange={e => this.updateFilter('type', e.target.value)}>
            <option value="all">All</option>
            <option value="forked">Forked</option>
            <option value="sources">Sources</option>
          </select>
          <label htmlFor="updated">Updated after: </label>
          <input
            id="updated"
            type="date"
            value={query.updated || 0}
            onChange={e => this.updateFilter('updated', e.target.value)}
          />
          <label htmlFor="issues">Has issues:</label>
          <input
            type="checkbox"
            checked={query.hasIssues}
            id="issues"
            value=""
            onChange={e => this.updateFilter('hasIssues', e.target.checked)}
          />
          <label htmlFor="topics">Has topics:</label>
          <input
            type="checkbox"
            checked={query.topics}
            id="topics"
            value=""
            onChange={e => this.updateFilter('topics', e.target.checked)}
          />
          <label htmlFor="starred">Stars >=:</label>
          <input
            type="number"
            value={query.starred || 0}
            size="4"
            id="starred"
            onChange={e => this.updateFilter('starred', Number(e.target.value))}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const query = queryString.parse(ownProps.location.search)
  const defaultQuery = { sort: 'name', order: 'asc', language: 'all', type: 'all' }

  return ({
    query: Object.assign({}, defaultQuery, query)
  })
}

export default withRouter(connect(mapStateToProps)(Filters))
