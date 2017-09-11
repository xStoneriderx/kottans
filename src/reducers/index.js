import { combineReducers } from 'redux'

const repos = (state = {
  data: [],
  isFetching: false,
  nextPageUrl: '',
  owner: {}
}, action) => {
  const { type, payload } = action
  switch (type) {
    case 'GET_REPOS_REQUEST':
      return { data: [], isFetching: true, nextPageUrl: '', owner: {} }
    case 'GET_REPOS_SUCCESSFUL':
      return {
        ...state,
        isFetching: false,
        data: payload.data,
        owner: payload.owner,
        nextPageUrl: payload.nextPageUrl
      }
    case 'ADD_REPOS_SUCCESSFUL':
      return {
        ...state,
        isFetching: false,
        data: state.data.concat(payload.data),
        nextPageUrl: payload.nextPageUrl
      }
    case 'ADD_ERROR':
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}

const modal = (state = { modalIsOpen: false, isFetching: false, data: [] }, action) => {
  const { type, payload } = action
  switch (type) {
    case 'MODAL_HIDE':
      return { ...state, modalIsOpen: false }
    case 'MODAL_INIT':
      return {
        modalIsOpen: true,
        isFetching: true,
        data: []
      }
    case 'MODAL_SHOW':
      return {
        modalIsOpen: true,
        isFetching: false,
        data: payload.data,
        repo_url: payload.repo_url
      }
    case 'ADD_ERROR':
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const errorMessage = (state = '', action) => {
  const { type, error } = action

  switch (type) {
    case 'CLEAR_ERROR':
      return ''
    case 'ADD_ERROR':
      return error
    default:
      return state
  }
}

const rootReducer = combineReducers({
  repos,
  modal,
  errorMessage,
})

export default rootReducer
