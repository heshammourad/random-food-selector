import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { login } from '../../api/api';
import { useAuth } from '../../context/auth';

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
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {isError && (
          <Typography color="error" variant="caption">
            An error occurred. Please try again.
          </Typography>
        )}
        <Button type="submit" fullWidth variant="contained" color="primary" className="btn-login">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default Login;
