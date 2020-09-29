import React, { useState, useEffect, ReactElement } from 'react';
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
import Messaging from './components/Messaging';
import UpdateProject from './components/UpdateProject';
import UpdateMission from './components/UpdateMission';
import ManageMember from './components/ManageMember';

function App() {

  const ConnexionRoute = ({path, ...props}) => {
    const auth = useAuth();
    return  auth.isLogged ? <Redirect to={'/'} /> : <Route {...props} path={path} />;
  }

  const AuthRoute = ({path, ...props}) => {
    const auth = useAuth();
    return  auth.isLogged ? <Route exact path={path} {...props} /> : <Redirect to='/'  />;
  }

  const OwnerRoute = ({path, ...props}) => {
    const auth = useAuth();
    const [ownerRoute, setOwnerRoute] = useState(true);
    useEffect(() => {
      const start = async () => {
        const owner = await auth.isAOwner(props.computedMatch.params.projectId);
        setOwnerRoute(owner);
      }
      start();
    })
    return !auth.isLogged ? <Redirect to='/'  /> : (ownerRoute ? <Route exact path={path} {...props} /> :  <Redirect to='/'  />);
  }

  const AdminRoute = ({path, ...props}) => {
    const auth = useAuth();
    const [adminRoute, setAdminRoute] = useState(true);
    useEffect(() => {
      const start = async () => {
        const admin = await auth.isAAdmin(props.computedMatch.params.projectId);
        setAdminRoute(admin);
      }
      start();
    })
    return  !auth.isLogged ? <Redirect to='/'  /> : ( adminRoute ? <Route exact path={path} {...props} /> :  <Redirect to='/'  /> );
  }

  const MemberRoute = ({path, ...props}) => {
    const auth = useAuth();
    const [memberRoute, setMemberRoute] = useState(true);
    useEffect(() => {
      const start = async () => {
        const member = await auth.isAssigned(props.computedMatch.params.missionId);
        setMemberRoute(member);
      }
      start();
    })
    return !auth.isLogged ? <Redirect to='/'  /> : ( memberRoute ? <Route exact path={path} {...props} /> :  <Redirect to='/'  />);
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
          <AdminRoute exact component={InviteMember} path='/inviteMember/:projectId' />
          <AdminRoute exact component={ProjectMessaging} path='/projectMessaging/:projectId' />
          <AuthRoute exact component={AddProject} path='/addProject' />
          <AuthRoute exact component={Messaging} path='/messaging' />
          <OwnerRoute exact component={UpdateProject} path='/updateProject/:projectId' />
          <MemberRoute exact component={UpdateMission} path='/updateMission/:missionId' />
          <AuthRoute exact component={AddMission} path='/addMission/:projectId' />
          <AdminRoute exact component={ManageMember} path='/manageMember/:projectId' />
          <Route exact component={Project} path='/project/:id' />
          <AuthRoute exact component={UpdateUser} path='/updateUser/:id' />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
