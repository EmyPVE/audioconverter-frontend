import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import Modal from '../components/Modal';

const MyAccountPage = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState({
    username: '',
    name: '',
    subscription: '',
    createdAt: '',
    expirationDate: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://localhost:8000/api/user/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    })
    .then(data => {
      setUser({
        username: data.username,
        subscription: data.subscription,
        createdAt: data.created_at.slice(0, 10),
        expirationDate: data.end_date,
      });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePasswordChange = () => {
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const token = localStorage.getItem('token');

    fetch('https://localhost:8000/api/change-password/', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to change password');
      }
      return response.json();
    })
    .then(data => {
      alert("Password changed successfully!");
      closeModal();
    })
    .catch(error => {
      console.error('Error changing password:', error);
    });
  };


  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="container mt-4">
      <h2>My Account</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Subscription:</strong> {user.subscription}
      </p>
      <p>
        <strong>Created At:</strong> {user.createdAt}
      </p>
      <p>
        <strong>Expiration Date:</strong> {user.expirationDate}
      </p>
      <button className="btn btn-primary" onClick={openModal} style={{ marginRight: '10px' }}>
        Change Password
      </button>
      <Modal show={isModalOpen} onClose={closeModal}>
        <form onSubmit={e => e.preventDefault()}>
          <input
            type="password"
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handleInputChange}
            placeholder="Old Password"
          />
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleInputChange}
            placeholder="New Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm New Password"
          />
          <button type="submit" onClick={handlePasswordChange} className="btn btn-primary">
            Change Password
          </button>
        </form>
      </Modal>
      <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default MyAccountPage;
