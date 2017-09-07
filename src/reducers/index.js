import { combineReducers } from 'redux'

const repos = (state = {
  data: [],
  isFetching: false,
  nextPageUrl: undefined
}, action) => {
  const { type, payload } = action
  switch (type) {
    case 'GET_REPOS_REQUEST':
      return { data: [], isFetching: true, nextPageUrl: undefined }
    case 'GET_REPOS_SUCCESSFUL':
      return {
        ...state,
        isFetching: false,
        data: payload.data,
        nextPageUrl: payload.nextPageUrl
      }
    default:
      return state
  }
}

const modal = (state = { modalIsOpen: false, data: {} }, action) => {
  const { type, payload } = action
  switch (type) {
    case 'MODAL_HIDE':
      return { modalIsOpen: false, data: {} }
    case 'MODAL_INIT':
      return {
        modalIsOpen: true, data: {}
      }
    case 'MODAL_SHOW':
      return {
        ...state,
        data: payload.data
      }
    default:
      return state
  }
}

const errorMessage = (state = null, action) => {
  const { type, error } = action

  switch (type) {
    case 'CLEAR_ERROR':
      return null
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
