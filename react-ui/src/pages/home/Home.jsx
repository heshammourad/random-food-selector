import React from 'react';
import { Redirect } from 'react-router-dom';

import { useAuth } from '../../context/auth';

const Home = () => {
  const { authToken } = useAuth();

  return <Redirect to={authToken ? '/types' : '/login'} />;
};

export default Home;
