import React from 'react';
import '../cssmodal/LimitReachedModal.css';

const LimitReachedModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

    return (
        <div className="limit-modal-overlay">
            <div className="limit-modal">
                <h4>Limit reached</h4>
                <p>You have reached the 3 conversions limit for today. Subscribe, login if you already have a subscription or come back tomorrow!</p>
                <button onClick={() => window.location.href='/login'}>Login</button>
                <button onClick={() => window.location.href='/subscriptions'}>Subscribe</button>
            </div>
        </div>
    );
};

export default LimitReachedModal;
