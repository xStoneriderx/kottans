/* eslint-disable camelcase */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Timestamp from 'react-timestamp'
import Modal from 'react-modal';
import { closeModal } from '../actions/index'
import Preloader from '../components/Preloader'

class RepoModal extends Component {
  static propTypes = {

  }

  modalBody() {
    const { modal: { isFetching, data, repo_url } } = this.props
    return isFetching || data.length === 0 ? <Preloader /> : (
      <div>
        Url: <a href={repo_url}>Link</a>
        <div>{
          this.renderContirbutors(data[0].data) || //TODO
          <p>No contributions founded</p>
        }</div>
        {this.renderLanguages(data[1].data)}
        <div>{
          this.renderPRs(data[2].data) || //TODO
          <p>No open PRs founded</p>
        }</div>
      </div>
    );
  }

  renderContirbutors(contr) {
    return (
      contr.map(key => (
        <div key={key.id}>
          <a href={key.html_url} target="_blank"><img src={key.avatar_url} alt={key.login} /></a>
          <a href={key.html_url} target="_blank">{key.login}</a>
          {key.contributions}
        </div>
      ))
    )
  }

  renderLanguages(langs) {
    return (<ul>
      {Object.keys(langs).map(key => (
        langs[key] > 1000 ? <li key={key}>{key}: {langs[key]}KB</li> : ''
      ))}
    </ul>)
  }

  renderPRs(prs) {
    return (
      Object.keys(prs).map(key => (
        key.opened ? <div key={key.id}><a href={key.html_url}>{key.title}</a></div> : null
      ))
    )
  }

  renderError() {
    const { errorMessage, modal: { isFetching } } = this.props
    return errorMessage && !isFetching ? <h2>{errorMessage}</h2> : ''
  }

  render() {
    const { closeModal, errorMessage, modal : { modalIsOpen, data, isFetching} } = this.props
    return (
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Card Modal Example"
        onRequestClose={closeModal}
      >
        <button onClick={closeModal}>X</button>
        {this.renderError() || this.modalBody()}
      </Modal>
    )
  }
}

export default connect(state => ({ modal: state.modal, errorMessage: state.errorMessage }), { closeModal })(RepoModal)
