import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import Login from './components/login/Login';
import Users from './components/users/Users';
import CreateUser from './components/users/CreateUser';

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/userlist" element={<Users />} />
          <Route path="/createuser" element={<CreateUser />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
