//import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
//import paginate from './paginate'
import { combineReducers } from 'redux'

const repos = (state = { data: [] }, action) => {
  const { type, payload } = action
  switch (type) {
    case 'REPOS_SUCCESSFUL':
      return payload
    default:
      return state
  }
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { error } = action

  if (error) {
    return error
  }

  return state
}

const rootReducer = combineReducers({
  repos,
  errorMessage,
})

export default rootReducer
