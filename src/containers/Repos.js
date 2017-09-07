import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getRepos, openModal } from '../actions/index'
import Repo from '../components/Repo'
import Filters from '../containers/Filters'
import queryString from 'query-string'
import * as _ from 'lodash'

class Repos extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired
  }

  componentWillMount() {
    this.props.getRepos(this.props.user)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.props.getRepos(nextProps.user)
    }
  }

  openRepo = (repoId) => {
    const repo = this.props.filteredRepos[repoId]
    this.props.openModal(repo)
  }

  renderRepos() {
    const { filteredRepos, isFetching, errorMessage } = this.props
    const isEmpty = filteredRepos.length === 0
    if (isEmpty && isFetching && !errorMessage) {
      return <h2>Loading data, please wait...</h2>
    } else if (isEmpty && !errorMessage) {
      return <h2>Nothing to show :(</h2>
    }
    return (
      filteredRepos.map((repo, index) => {
        repo.slicedDescription = repo.description ? `${repo.description.slice(0, 60)} ...` : '' // eslint-disable-line no-param-reassign
        return (
          <Repo
            id={index}
            repo={repo}
            onClick={this.openRepo}
            key={repo.id}
          />
        )
      })
    )
  }

  renderError() {
    const { errorMessage } = this.props
    return errorMessage ? <h2>{errorMessage}</h2> : ''
  }

  render() {
    const { user } = this.props
    return (
      <div>
        <Filters />
        <p>{user}</p>
        {this.renderError()}
        {this.renderRepos()}
      </div>
    )
  }
}
function filterRepos(repos, query) {
  if (!Object.keys(query).length) return (repos)
  let filteredRepos = _.cloneDeep(repos)
  for (const key in query) {
    if (query[key] === 'all') continue
    switch (key) {
      case 'sort':
        const order = query.order === 'asc' ? 1 : -1 // eslint-disable-line no-case-declarations
        filteredRepos = filteredRepos.sort((a, b) => {
          return query.sort === 'name'
            ? a[query.sort].toLowerCase() > b[query.sort].toLowerCase() ? order : -1 * order
            : a[query.sort] > b[query.sort] ? order : -1 * order;
        })
        break;
      case 'language':
        filteredRepos = filteredRepos.filter(item => item.language === query.language)
        break;
      case 'type':
        filteredRepos = filteredRepos.filter(item => item.fork === true && query.type === 'forked')
        break;
      case 'updated':
        filteredRepos = filteredRepos.filter(item => item.updated_at >= Date.parse(query.updated) / 1000)
        break;
      case 'issues':
        filteredRepos = filteredRepos.filter(item => item.has_issues === true)
        break;
      case 'topics':
        filteredRepos = filteredRepos.filter(item => item.topics.length > 0)
        break;
      case 'starred':
        filteredRepos = filteredRepos.filter(item => item.stargazers_count >= query.starred)
        break;
      default :
    }
  }
  return filteredRepos
}

const mapStateToProps = (state, ownProps) => {
  const { isFetching } = state.repos
  const { errorMessage } = state
  const user = ownProps.match.params.user
  const repos = state.repos.data
  const query = queryString.parse(ownProps.location.search)
  const filteredRepos = filterRepos(repos, query)
  return {
    user,
    filteredRepos,
    query,
    isFetching,
    errorMessage
  }
}


export default withRouter(connect(mapStateToProps, { getRepos, openModal })(Repos))
