import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
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
      <Container maxWidth="xs">
        <CssBaseline />
        <Router>
          <div>
            <Typography component="h1" variant="h5">
              Random Food Selector
            </Typography>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute path="/types" component={Types} />
          </div>
        </Router>
      </Container>
    </AuthContext.Provider>
  );
};

export default App;
