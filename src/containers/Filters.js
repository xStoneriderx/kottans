import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

class Filters extends Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
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
    const { query, languages } = this.props
    return (
      <div className="filters-container">
        <label htmlFor="sort">Sort:</label>
        <select id="sort" value={query.sort} onChange={e => this.updateFilter('sort', e.target.value)}>
          <option value="name">Name</option>
          <option value="stargazers_count">Stars</option>
          <option value="open_issues_count">Issues</option>
          <option value="updated_at">Updated</option>
        </select>
        <label htmlFor="order">Sort order:</label>
        <select id="order" value={query.order} onChange={e => this.updateFilter('order', e.target.value)}>
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
        <label htmlFor="language">Language:</label>
        <select id="language" value={query.language} onChange={e => this.updateFilter('language', e.target.value)} >
          <option value="all">All</option>
          {Array.from(languages).map(lang => <option key={lang} value={lang}>{lang}</option>)}
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
          value={query.updated || ''}
          onChange={e => this.updateFilter('updated', e.target.value)}
        />
        <label htmlFor="issues">Has issues:</label>
        <input
          type="checkbox"
          checked={query.issues !== undefined}
          id="issues"
          value=""
          onChange={e => this.updateFilter('issues', e.target.checked)}
        />
        <label htmlFor="topics">Has topics:</label>
        <input
          type="checkbox"
          checked={query.topics !== undefined}
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
    )
  }
}

function getLanguages(repos) {
  const languages = new Set()
  repos.forEach(item => (item.language !== null ? languages.add(item.language) : ''))
  return languages
}

const mapStateToProps = (state, ownProps) => {
  const query = queryString.parse(ownProps.location.search)
  const defaultQuery = { sort: 'name', order: 'asc', language: 'all', type: 'all' }
  const languages = getLanguages(ownProps.reposFilteredWithoutLang)

  return ({
    query: Object.assign({}, defaultQuery, query),
    languages
  })
}

export default withRouter(connect(mapStateToProps)(Filters))
