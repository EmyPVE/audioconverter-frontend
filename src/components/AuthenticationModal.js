import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AuthenticationModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Authentication Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You need to be logged in to choose a subscription plan.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={() => window.location.href='/login'}>Login</Button>
        <Button variant="success" onClick={() => window.location.href='/signup'}>Sign Up</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AuthenticationModal;
