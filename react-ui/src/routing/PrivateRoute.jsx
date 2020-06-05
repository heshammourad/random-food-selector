/* eslint-disable react/jsx-props-no-spreading */
import { useAuth } from '../context/auth';

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default PrivateRoute;
