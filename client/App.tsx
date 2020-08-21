import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Profil from './components/Profil';
import Home from './components/Home';
import Project from './components/Project';
import AddUser from "./components/AddUser";
import Connexion from "./components/Connexion";
import SendResetPassword from "./components/SendResetPassword";
import ResetPassword from "./components/ResetPassword";
import AddProject from "./components/AddProject";
import AddMission from "./components/AddMission";
import "fontsource-acme";
import useAuth from "./hooks/useAuth";

function App() {
  const auth = useAuth();
  const [goodPath, setGoodPath] = useState('/')
  const AuthRoute = ({ path, ...props}) => {
    if (window.location.pathname !== "/" && window.location.pathname !== "/connexion") {
      setGoodPath(window.location.pathname)
    }
    return auth.isLogged ? <Route {...props} path={path} /> : <Redirect to="/connexion" />
  }

  const ConnexionRoute = ({path, ...props}) => {
    return auth.isLogged ? <Redirect to={goodPath} /> : <Route {...props} path={path} />
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <ConnexionRoute exact component={Connexion} path='/connexion' />
          <Route exact component={AddUser} path='/addUser' />
          <Route exact component={SendResetPassword} path='/resetPassword' />
          <Route exact component={ResetPassword} path='/resetPassword/:userId/:token' />
          <AuthRoute exact component={Home} path='/' />
          <AuthRoute exact component={Profil} path='/profil/:id' />
          <AuthRoute exact component={AddProject} path='/addProject' />
          <AuthRoute exact component={AddMission} path='/addMission/:projectId' />
          <AuthRoute exact component={Project} path='/project/:id' />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
