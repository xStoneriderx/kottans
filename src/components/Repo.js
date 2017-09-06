import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Timestamp from 'react-timestamp'

export default class Repo extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    repoName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    starsCount: PropTypes.number.isRequired,
    updatedDate: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    language: PropTypes.string,
    isFork: PropTypes.bool.isRequired,
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
    const { repoName, description, starsCount, updatedDate, language, isFork } = this.props
    return (
      <div onClick={this.handleOnClick} style={{ width: '400px', display: 'inline-block', margin: '10px', padding: '10px', border: '2px black solid' }}>
        <div>
          {repoName}
          <Timestamp time={updatedDate} />
        </div>
        <div>
          {description}
        </div>
        <div>
          {starsCount}
          {language}
          {isFork ? 'Forked' : ''}
        </div>
      </div>
    )
  }
}
