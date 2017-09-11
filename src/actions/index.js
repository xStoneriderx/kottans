/* eslint-disable no-param-reassign */
const API_ROOT = 'https://api.github.com/'

const getNextPageUrl = (response) => {
  const link = response.headers.get('link')
  if (!link) {
    return ''
  }
  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return ''
  }
  return nextLink.split(';')[0].slice(1, -1)
}

const callApi = (endpoint) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  const headers = new Headers()
  headers.append('Accept', 'application/vnd.github.mercy-preview+json') // Needed to get repo topics

  return fetch(fullUrl, { headers })
    .then(response =>
      response.json().then((json) => {
        if (!response.ok) return Promise.reject({ ...json, status: response.status })
        const nextPageUrl = getNextPageUrl(response)
        return Object.assign({},
          { data: json },
          { nextPageUrl }
        )
      })
    )
}

export const getRepos = endPoint => (dispatch) => {
  dispatch({
    type: 'GET_REPOS_REQUEST'
  })
  dispatch({
    type: 'CLEAR_ERROR'
  })
  const fullEndPoint = `users/${endPoint}/repos?per_page=100`
  return callApi(fullEndPoint).then(response =>
    dispatch({
      type: 'GET_REPOS_SUCCESSFUL',
      payload: { ...response,
        data: response.data.map(item => ({ ...item, updated_at: Date.parse(item.updated_at) / 1000 })),
        owner: response.data[0].owner
      }
    }),
  (error) => {
    error.message = error.status === 403 ? 'Sorry, API rate limit exceeded, try again later.' : error.message
    dispatch({ type: 'ADD_ERROR', error: error.message })
  })
}

export const addRepos = endPoint => (dispatch) => {
  dispatch({
    type: 'CLEAR_ERROR'
  })
  return callApi(endPoint).then(response =>
    dispatch({
      type: 'ADD_REPOS_SUCCESSFUL',
      payload: { ...response,
        data: response.data.map(item => ({ ...item, updated_at: Date.parse(item.updated_at) / 1000 })),
        owner: response.data[0].owner
      }
    }),
  (error) => {
    error.message = error.documentation_url && 'Sorry, API rate limit exceeded, try again later.'
    dispatch({ type: 'ADD_ERROR', error: error.message })
  })
}

export const openModal = repo => (dispatch) => {
  dispatch({
    type: 'MODAL_INIT'
  })
  const repoUrls = [
    `${repo.contributors_url}?sort=popularity&direction=desc&per_page=3`,
    repo.languages_url,
    `${repo.url}/pulls?sort=popularity&direction=desc&per_page=5`
  ]
  return Promise.all(repoUrls.map(url => callApi(url))).then((data) => {
    dispatch({
      type: 'MODAL_SHOW',
      payload: {
        data,
        repo_url: repo.html_url
      }
    })
  },
  error => dispatch({ type: 'ADD_ERROR', error: error.message })
  )
}

export const closeModal = () => ({ type: 'MODAL_HIDE' })
