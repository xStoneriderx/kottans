const API_ROOT = 'https://api.github.com/'

const getNextPageUrl = (response) => {
  const link = response.headers.get('link')
  if (!link) {
    return null
  }
  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return null
  }
  return nextLink.split(';')[0].slice(1, -1)
}

const callApi = (endpoint) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(fullUrl)
    .then(response =>
      response.json().then((json) => {
        if (!response.ok) return Promise.reject(json)

        const nextPageUrl = getNextPageUrl(response)
        return Object.assign({},
          { data: json },
          { nextPageUrl }
        )
      })
    )
}

export const getRepos = endPoint => (dispatch) => {
  const fullEndPoint = `users/${endPoint}/repos?per_page=100`
  return callApi(fullEndPoint).then((response) => {
    return dispatch({
      type: 'REPOS_SUCCESSFUL',
      payload: { ...response, data: response.data.map(item => ({ ...item, updated_at: Date.parse(item.updated_at)/1000 })) }
    })
  })
}

export const openModal = repo => (dispatch) => {
  const repoUrls = [
    `${repo.contributors_url}?sort=popularity$direction=desc$per_page=3`,
    repo.languages_url,
    `${repo.url}/pulls?sort=popularity&direction=desc&per_page=5`
  ]
  return Promise.all(repoUrls.map(url => callApi(url))).then((data) => {
    console.log(data)
  })
}
