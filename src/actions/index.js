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
          json,
          { nextPageUrl }
        )
      })
    )
}

export function getRepos(endpoint) {
  const fullEndPoint = `users/${endpoint}/repos`
  callApi(fullEndPoint).then(response => console.log('data: ', response))
}
