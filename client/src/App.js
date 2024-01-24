import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/users/Users';
import CreateUser from './components/users/CreateUser';
import EditUser from './components/users/EditUser';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import Unathorized from './components/Unauthorized';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unathorized />} />
        
        <Route element={<RequireAuth allowedRole={0} />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        
        <Route element={<RequireAuth allowedRole={1} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/userlist" element={<Users />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/edituser/:email" element={<EditUser />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
