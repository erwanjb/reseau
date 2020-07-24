import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Profil from './components/Profil';
import Home from './components/Home';
import Project from './components/Project';
import AddUser from "./components/AddUser";
import "fontsource-acme"

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact component={Home} path='/' />
          <Route exact component={Profil} path='/profil/:id' />
          <Route exact component={Project} path='/project' />
          <Route exact component={AddUser} path='/addUser' />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
