import React, { useState } from 'react';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

  const handleSignUp = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    const userData = {
      username,
      email,
      password,
    };
  
    fetch('https://localhost:8000/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => {
      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('User created successfully!');
        setErrorMessage('');
      } else if (response.status === 400) {
        response.json()
          .then(data => {
            setSuccessMessage('');
            setErrorMessage("User with this username already exists.");
          })
          .catch(error => {
            console.error('Error parsing JSON response:', error);
            setErrorMessage('An error occurred.');
          });
      } else {
        console.error('Unexpected response status:', response.status);
        setErrorMessage('An unexpected error occurred.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setErrorMessage('An error occurred.');
    });
  }

  return (
    <div className="container mt-4">
      {successMessage && (
        <div className="alert alert-success mt-3">
          User created successfully!
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger mt-3">
          {errorMessage}
        </div>
      )}
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpPage;
