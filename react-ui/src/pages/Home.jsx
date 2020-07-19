import { useAuth } from '../context/auth';

import React from 'react';
import { Redirect } from 'react-router-dom';

const Home = () => {
  const { authToken } = useAuth();

  return <Redirect to={authToken ? '/types' : '/login'} />;
};

export default Home;
