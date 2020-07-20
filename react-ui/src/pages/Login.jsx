import { login } from '../api/api';
import { useAuth } from '../context/auth';

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import './Login.css';

const Login = () => {
  const [isError, setIsError] = useState(false);
  const { authToken, setAuthToken } = useAuth();

  if (authToken) {
    return <Redirect to="/" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const isValid = await login(username, password);
    if (isValid) {
      const token = { username, password };
      setAuthToken(token);
    } else {
      setIsError(true);
    }
  };

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
