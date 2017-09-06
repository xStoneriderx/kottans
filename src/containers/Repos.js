import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getRepos, openModal } from '../actions/index'
import Repo from '../components/Repo'
import Filters from '../containers/Filters'
import queryString from 'query-string'

class Repos extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    repos: PropTypes.array.isRequired
  }

  componentWillMount() {
    this.props.getRepos(this.props.user)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.props.getRepos(nextProps.user)
    }
  }

  filterRepos(){
    const { query, repos } = this.props
    if (!Object.keys(query).length) return (repos)
    let filteredRepos = repos
    for (const key in query) {
      switch (key) {
        case 'sort':
          const order = query.order === 'asc' ? 1 : -1 // eslint-disable-line no-case-declarations
          filteredRepos = filteredRepos.sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return order
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1 * order
          })
          break;
        case 'language':
          
      }
    }
    return filteredRepos
  }

  openRepo = (repoId) => {
    const repo = this.props.repos[repoId]
    this.props.openModal(repo)
  }

  render() {
    const { user, repos } = this.props
    const filteredRepos = this.filterRepos()
    console.log(filteredRepos)
    return (
      <div>
        <Filters />
        <p>{user}</p>
        {repos.map((repo, index) => {
          repo.description = repo.description ? `${repo.description.slice(0, 60)} ...` : '' // eslint-disable-line no-param-reassign
          return (
            <Repo
              id={index}
              repoName={repo.name}
              description={repo.description}
              starsCount={repo.stargazers_count}
              updatedDate={repo.updated_at}
              language={repo.language}
              isFork={repo.fork}
              onClick={this.openRepo}
              key={repo.id}
            />
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // We need to lower case the login due to the way GitHub's API behaves.
  // Have a look at ../middleware/api.js for more details.
  const user = ownProps.match.params.user
  const repos = Object.values(state.repos.data)
  const query = queryString.parse(ownProps.location.search)
  return {
    user,
    repos,
    query
  }
}


export default withRouter(connect(mapStateToProps, { getRepos, openModal })(Repos))
