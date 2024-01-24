import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from './AuthContext';

function NavigationBar() {
  const { isAuthenticated } = useAuth();

  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/" style={{ marginLeft: '15px' }}>
        <Navbar.Brand >Audio Converter</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to="/subscriptions">
            <Nav.Link>Subscriptions</Nav.Link>
          </LinkContainer>
          {!isAuthenticated && (
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          )}
          {isAuthenticated && (
            <LinkContainer to="/myaccount">
              <Nav.Link>My Account</Nav.Link>
            </LinkContainer>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
