/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from '../context/auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authToken } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => (authToken ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default PrivateRoute;
