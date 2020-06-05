import { useAuth } from '../context/auth';

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import './Login.css';

const Login = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const { authToken, setAuthToken } = useAuth();

  if (!isLoggedIn && authToken === process.env.PASSWORD) {
    setLoggedIn(true);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
      setAuthToken(password);
      setLoggedIn(true);
    } else {
      setIsError(true);
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>
        {isError && <div className="error">Please choose a username.</div>}
        <Button variant="secondary" type="submit">
          Log In
        </Button>
      </Form>
    </div>
  );
};

export default Login;
