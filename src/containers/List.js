/* eslint-disable no-continue,no-restricted-syntax */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getRepos, openModal, addRepos } from '../actions/index'
import Repo from '../components/Repo'
import Preloader from '../components/Preloader'
import Filters from '../containers/Filters'
import queryString from 'query-string'
import * as _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'

class List extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    getRepos: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    filteredRepos: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    reposFilteredWithoutLang: PropTypes.array.isRequired,
    nextPageUrl: PropTypes.string.isRequired,
    addRepos: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.loadMore = this.loadMore.bind(this)
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

  loadMore() {
    const { nextPageUrl, addRepos } = this.props
    addRepos(nextPageUrl)
  }

  renderRepos() {
    const { filteredRepos, isFetching, errorMessage, query } = this.props
    const hideLanguage = !(query.language === 'all' || query.language === undefined)
    const hideType = !(query.type === 'all' || query.type === undefined)
    const isEmpty = filteredRepos.length === 0
    if (isEmpty && isFetching && !errorMessage) {
      return <Preloader />
    } else if (isEmpty && !errorMessage) {
      return <h2>Nothing to show :(</h2>
    }
    return (
      <div className="repos-container">
        {filteredRepos.map((repo, index) => {
          repo.slicedDescription = repo.description ? `${repo.description.slice(0, 60)} ...` : '' // eslint-disable-line no-param-reassign
          return (
            <Repo
              hideLanguage={hideLanguage}
              hideType={hideType}
              id={index}
              repo={repo}
              onClick={this.openRepo}
              key={repo.id}
            />
          )
        })}
      </div>
    )
  }

  renderError() {
    const { errorMessage } = this.props
    return errorMessage ? <h2>{errorMessage}</h2> : ''
  }

  render() {
    const { reposFilteredWithoutLang, nextPageUrl } = this.props
    return (
      <div className="main-container">
        <Filters reposFilteredWithoutLang={reposFilteredWithoutLang} />
        {this.renderError()}
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMore}
          hasMore={!!nextPageUrl}
          loader={<Preloader />}
        >
          {this.renderRepos()}
        </InfiniteScroll>
      </div>
    )
  }
}
function filterRepos(repos, query) {
  let filteredRepos = _.cloneDeep(repos)
  let reposFilteredWithoutLang
  const queryEmpty = !Object.keys(query).length
  if (!queryEmpty) {
    for (const key in query) {
      if (query[key] === 'all' || query[key] === '') continue
      switch (key) {
        case 'sort':
          const order = query.order === 'asc' ? 1 : -1 // eslint-disable-line no-case-declarations
          filteredRepos = filteredRepos.sort((a, b) => (
            query.sort === 'name'
              ? a[query.sort].toLowerCase() > b[query.sort].toLowerCase() ? order : -1 * order
              : a[query.sort] > b[query.sort] ? order : -1 * order
          ))
          break
        case 'type':
          filteredRepos = filteredRepos.filter(item => (query.type === 'forked' ? item.fork === true : item.fork === false))
          break
        case 'updated':
          filteredRepos = filteredRepos.filter(item => item.updated_at >= Date.parse(query.updated) / 1000)
          break
        case 'issues':
          filteredRepos = filteredRepos.filter(item => item.has_issues === true)
          break
        case 'topics':
          filteredRepos = filteredRepos.filter(item => item.topics.length > 0)
          break
        case 'starred':
          filteredRepos = filteredRepos.filter(item => item.stargazers_count >= query.starred)
          break
        default :
      }
    }
    reposFilteredWithoutLang = _.cloneDeep(filteredRepos)
    if (query.language !== undefined && query.language !== 'all') {
      filteredRepos = filteredRepos.filter(item => item.language === query.language)
    }
  }
  reposFilteredWithoutLang = reposFilteredWithoutLang === undefined ? filteredRepos : reposFilteredWithoutLang
  return { filteredRepos, reposFilteredWithoutLang }
}

const mapStateToProps = (state, ownProps) => {
  const { isFetching, nextPageUrl } = state.repos
  const { errorMessage } = state
  const user = ownProps.match.params.user
  const repos = state.repos.data
  const query = queryString.parse(ownProps.location.search)
  const { filteredRepos, reposFilteredWithoutLang } = filterRepos(repos, query)
  return {
    user,
    filteredRepos,
    reposFilteredWithoutLang,
    query,
    isFetching,
    errorMessage,
    nextPageUrl
  }
}


export default withRouter(connect(mapStateToProps, { getRepos, openModal, addRepos })(List))
