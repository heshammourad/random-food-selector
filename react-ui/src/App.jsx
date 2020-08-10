import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { Link as RouterLink, BrowserRouter as Router, Route } from 'react-router-dom';

import { AuthContext } from './context/auth';
import {
  Home, Items, Login, Types,
} from './pages';
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
              <Link component={RouterLink} to="/">
                Random Food Selector
              </Link>
            </Typography>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/types" component={Types} />
            <PrivateRoute path="/types/:typeId" component={Items} />
          </div>
        </Router>
      </Container>
    </AuthContext.Provider>
  );
};

export default App;
