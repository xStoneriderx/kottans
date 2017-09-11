import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Form extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setInputValue(nextProps.value)
    }
  }

  setInputValue = (val) => {
    this.input.value = val
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleGoClick()
    }
  }

  handleGoClick = () => {
    this.props.onSubmit(this.input.value)
  }

  render() {
    return (
      <div>
        <h4>Type a username/organization: </h4>
        <input
          size="45"
          ref={input => this.input = input}
          defaultValue={this.props.value}
          onKeyUp={this.handleKeyUp}
        />
        <button onClick={this.handleGoClick}>
          Search
        </button>
      </div>
    )
  }
}
