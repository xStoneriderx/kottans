/* eslint-disable camelcase */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Timestamp from 'react-timestamp'
import NumericLabel from 'react-pretty-numbers'

export default class Repo extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    repo: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  handleOnClick() {
    this.props.onClick(this.props.id)
  }

  render() {
    const { repoName, updatedDate, slicedDescription, stargazers_count, language, isFork } = this.props.repo
    return (
      <div onClick={this.handleOnClick} style={{ width: '400px', display: 'inline-block', margin: '10px', padding: '10px', border: '2px black solid' }}>
        <div>
          {repoName}
          <Timestamp time={updatedDate} />
        </div>
        <div>
          {slicedDescription}
        </div>
        <div>
          <NumericLabel params={{ shortFormat: true, cssClass: ['class'] }}>{stargazers_count}</NumericLabel>
          {language}
          {isFork ? 'Forked' : ''}
        </div>
      </div>
    )
  }
}
