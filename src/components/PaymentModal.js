import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../cssmodal/PaymentModal.css';

const PaymentModal = ({ show, onHide, onConfirm, selectedSubscriptionId }) => {

    const handleSubmit = () => {
        onConfirm(selectedSubscriptionId);
        onHide();
      };

  return (
    <Modal show={show} onHide={onHide} className="payment-modal">
      <Modal.Header closeButton>
        <Modal.Title>Payment Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <Form.Control type="text" placeholder="Enter card number" />
          </Form.Group>
          <Form.Group controlId="cardExpiry">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control type="text" placeholder="MM/YY" />
          </Form.Group>
          <Form.Group controlId="cardCVC">
            <Form.Label>CVC</Form.Label>
            <Form.Control type="text" placeholder="CVC" />
          </Form.Group>
        </Form>
        <div className="payment-options">
        <p>Or choose a payment method:</p>
        <Button variant="outline-dark" className="btn-apple-pay" onClick={handleSubmit}>Apple Pay</Button>
        <Button variant="outline-dark" className="btn-google-pay" onClick={handleSubmit}>Google Pay</Button>
        <Button variant="outline-dark" className="btn-skrill" onClick={handleSubmit}>Skrill</Button>
        <Button variant="outline-dark" className="btn-paypal" onClick={handleSubmit}>PayPal</Button>
      </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Pay</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
