import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { AuthContext } from './context/auth';
import Home from './pages/Home';
import Login from './pages/Login';
import Types from './pages/Types';
import PrivateRoute from './routing/PrivateRoute';

const App = () => {
  const existingToken = JSON.parse(localStorage.getItem('token'));
  const [authToken, setAuthToken] = useState(existingToken);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      <Router>
        <div>
          <h1>Random Food Selector</h1>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute path="/types" component={Types} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
