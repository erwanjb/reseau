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
import InviteMember from "./components/InviteMember";
import "fontsource-acme";
import useAuth from "./hooks/useAuth";
import UpdateUser from './components/UpdateUser';
import ProjectMessaging from './components/ProjectMessaging';

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
    return auth.isLogged ? <Redirect to={'/'} /> : <Route {...props} path={path} />
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <ConnexionRoute exact component={Connexion} path='/connexion' />
          <Route exact component={AddUser} path='/addUser' />
          <Route exact component={SendResetPassword} path='/resetPassword' />
          <Route exact component={ResetPassword} path='/resetPassword/:userId/:token' />
          <Route exact component={Home} path='/' />
          <Route exact component={Profil} path='/profil/:id' />
          <Route exact component={InviteMember} path='/inviteMember/:projectId' />
          <Route exact component={ProjectMessaging} path='/projectMessaging/:projectId' />
          <AuthRoute exact component={AddProject} path='/addProject' />
          <AuthRoute exact component={AddMission} path='/addMission/:projectId' />
          <Route exact component={Project} path='/project/:id' />
          <AuthRoute exact component={UpdateUser} path='/updateUser/:id' />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
