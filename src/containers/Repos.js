import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getRepos } from '../actions/index'

class Repos extends Component {
  render() {
    const { user } = this.props
    return (
      <p>{user}</p>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // We need to lower case the login due to the way GitHub's API behaves.
  // Have a look at ../middleware/api.js for more details.
  const user = ownProps.match.params.user
  getRepos(user)
  /*const {
    pagination: { starredByUser },
    entities: { users, repos }
  } = state

  const starredPagination = starredByUser[login] || { ids: [] }
  const starredRepos = starredPagination.ids.map(id => repos[id])
  const starredRepoOwners = starredRepos.map(repo => users[repo.owner])*/

  return {
    user
  }
}

export default withRouter(connect(mapStateToProps)(Repos))
