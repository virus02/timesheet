import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/users/Users';
import CreateUser from './components/users/CreateUser';
import EditUser from './components/users/EditUser';

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userlist" element={<Users />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/edituser/:email" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
