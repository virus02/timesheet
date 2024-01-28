import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './components/login/Login';

import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import Unathorized from './components/Unauthorized';
import PersistLogin from './components/PersistLogin';

import Dashboard from './components/dashboard/Dashboard';
import Users from './components/users/Users';
import CreateUser from './components/users/CreateUser';
import EditUser from './components/users/EditUser';
import Projects from './components/projects/Projects';
import CreateProject from './components/projects/CreateProject';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unathorized />} />
        
        <Route element={<PersistLogin />}>

          <Route element={<RequireAuth allowedRole={[0,1]} />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
          
          <Route element={<RequireAuth allowedRole={[1]} />}>
            <Route path="/userlist" element={<Users />} />
            <Route path="/createuser" element={<CreateUser />} />
            <Route path="/edituser/:email" element={<EditUser />} />
            
            <Route path='/projectlist' element={<Projects />} />
            <Route path="/createproject" element={<CreateProject />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
