import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Form from '../components/Form'

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    inputValue: PropTypes.string.isRequired
  }

  handleInput = (input) => {
    this.props.history.push(`/${input}`)
  }

  render() {
    const { inputValue } = this.props
    return (
      <Form
        value={inputValue}
        onSubmit={this.handleInput}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.errorMessage,
  inputValue: ownProps.location.pathname.substring(1)
})

export default withRouter(connect(mapStateToProps)(App))
