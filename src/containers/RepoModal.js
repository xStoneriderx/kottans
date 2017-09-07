import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Timestamp from 'react-timestamp'
import Modal from 'react-modal';
import { closeModal } from '../actions/index'

class RepoModal extends Component {
  static propTypes = {

  }

  render() {
    const { closeModal, modal : { modalIsOpen, data} } = this.props
    return (
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Card Modal Example"
        onRequestClose={closeModal}
      >
        Test modal
      </Modal>
    )
  }
}

export default connect(state => ({ modal: state.modal }), { closeModal })(RepoModal)
