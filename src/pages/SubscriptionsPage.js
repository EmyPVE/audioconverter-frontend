import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../components/AuthContext';
import AuthenticationModal from '../components/AuthenticationModal';
import PaymentModal from '../components/PaymentModal';

function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch('https://localhost:8000/api/subscriptions/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setSubscriptions(data))
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  }, []);

  const handleChoosePlan = (subscriptionId) => {
    setSelectedSubscriptionId(subscriptionId);

    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSubmit = (subscriptionId) => {
    const token = localStorage.getItem('token');
    fetch('https://localhost:8000/api/update_subscription/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setShowPaymentModal(false);
      setSuccessMessage('Your subscription has been updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  };
  
  

  return (
    <div className="container mt-4">
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <h1 className="mb-4">Subscriptions</h1>
      <div className="row">
      {console.log("Subscriptions:", subscriptions)}
        {subscriptions.map(subscription => (
          <div key={subscription.id} className="col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{subscription.name}</Card.Title>
                <Card.Text>
                  {subscription.description}
                </Card.Text>
                <Card.Text>
                  Duration: {subscription.duration_months} months
                </Card.Text>
                <Card.Text>
                  Max conversions: {subscription.max_conversions_per_month} per month
                </Card.Text>
                <Button variant="primary" onClick={() => handleChoosePlan(subscription.id)}>Choose Plan</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
         <AuthenticationModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
         <PaymentModal 
        show={showPaymentModal} 
        onHide={() => setShowPaymentModal(false)} 
        onConfirm={handlePaymentSubmit} 
        selectedSubscriptionId={selectedSubscriptionId} 
      />
      </div>
    </div>
  );
}

export default SubscriptionsPage;
