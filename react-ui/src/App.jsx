import { AuthContext } from './context/auth';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoute from './routing/PrivateRoute';

import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

const App = () => {
  const existingToken = JSON.parse(localStorage.getItem('token'));
  const [authToken, setAuthToken] = useState(existingToken);

  const setToken = (data) => {
    localStorage.setItem('token', JSON.stringify(data));
    setAuthToken(data);
  };

  return (
    <AuthContext.Provider value={{ authToken, setToken }}>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home Page</Link>
            </li>
            <li>
              <Link to="/admin">Admin Page</Link>
            </li>
          </ul>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute path="/admin" component={Admin} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
