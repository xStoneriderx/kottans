/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route, HashRouter } from 'react-router-dom'
import App from './App'
import List from './List'
import styles from '../assets/style/styles.css'

const Root = ({ store }) => (
  <Provider store={store}>
    <HashRouter>
      <div>
        <Route path="/" component={App} />
        <Route
          path="/:user"
          component={List}
        />
      </div>
    </HashRouter>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root
