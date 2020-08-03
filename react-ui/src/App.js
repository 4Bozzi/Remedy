import React from "react";
import {
 BrowserRouter as Router,
 Switch,
 Route
} from "react-router-dom";

import './App.css';
import Home from './components/Home';
import Lobby from './components/Lobby';
import Admin from './components/Admin';

const App = (props) => {
  return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/lobby">
              <Lobby />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
          </Switch>
        </div>
      </Router>
  );
};

export default App;