/* eslint-disable camelcase */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal from 'react-modal';
import { closeModal } from '../actions/index'
import Preloader from '../components/Preloader'
import PrettyNumber from 'react-pretty-number'

class RepoModal extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    errorMessage: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  modalBody() {
    const { modal: { isFetching, data, repo_url } } = this.props
    return isFetching || data.length === 0 ? <Preloader /> : (
      <div>
        <a href={repo_url}>Link</a>
        <div className="modal__inner">
          <h4>Top contributors:</h4>
          {this.renderContirbutors(data[0].data)}
        </div>
        {this.renderLanguages(data[1].data)}
        <div className="modal__inner">
          <h4>Open PRs:</h4>
          {data[2].data.some(this.isOpenPRS)
            ? this.renderPRs(data[2].data)
            : <p>No open PRs founded</p>
          }
        </div>
      </div>
    );
  }

  isOpenPRS(prs) {
    return prs.state === 'open'
  }

  renderContirbutors(contr) {
    return (
      contr.map(key => (
        <div key={key.id} className="contributors">
          <a href={key.html_url} target="_blank"><img src={key.avatar_url} alt={key.login} /></a>
          <a href={key.html_url} target="_blank">{key.login}</a>
          {key.contributions}
        </div>
      ))
    )
  }

  renderLanguages(langs) {
    return (
      <ul>
        {Object.keys(langs).map(key => (
          langs[key] > 1000 ? <li key={key}>{key}: <PrettyNumber number={langs[key]} units={['', 'KB', 'GB']} /></li> : ''
        ))}
      </ul>)
  }

  renderPRs(prs) {
    return (
      prs.map(key => (
        key.state === 'open' ? <div key={key.id}><a href={key.html_url}>{key.title}</a></div> : null
      ))
    )
  }

  renderError() {
    const { errorMessage, modal: { isFetching } } = this.props
    return errorMessage && !isFetching ? <h2>{errorMessage}</h2> : ''
  }

  render() {
    const { closeModal, modal: { modalIsOpen } } = this.props
    const customStyles = {
      content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '400px'
      }
    }
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Repo modal"
      >
        <button onClick={closeModal} className="close-btn">X</button>
        {this.renderError() || this.modalBody()}
      </Modal>
    )
  }
}

export default connect(state => ({ modal: state.modal, errorMessage: state.errorMessage }), { closeModal })(RepoModal)
