import "./Login.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "../../api/axios";
import Card from '@mui/material/Card';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import useAuth from "../../hooks/useAuth";
const LOGIN_URL = 'login'

function Login() {
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState('');

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const snackBarAction = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={()=>setSnackBarOpen(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>  
  )

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({email: email, password: password}),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        }
      );
      const accessToken = response.data.token;
      const role = response.data.role;
      setAuth({ email, password, role, accessToken });
      setEmail('');
      setPassword('');
      setSnackBarOpen(true);
      setSnackBarMsg("Login successfull !!!");
      navigate('/userlist');
    } catch(err) {
      if (!err.response) {
        setErrMsg('No server response');
      } else if (err.response.status === 400) {
        setErrMsg('Missing email or password');
      } else if (err.response.status === 401) {
        setErrMsg('Unathorized');
      } else {
        setErrMsg('Login failed');
        setSnackBarOpen(true);
        setSnackBarMsg("Login failed !!!");
      }
      errRef.current.focus();
    }
  }

  return(
    <div className="login-container">
      <div className="login-form-container">
        <Card sx={{ padding: "10px", height: "35vh", alignItems: "center" }} raised>
          <h2 style={{ textAlign: "center" }}>LOGIN</h2>
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              onChange={e => setEmail(e.target.value)}
              required
              variant="outlined"
              color="primary"
              type="email"
              fullWidth
              sx={{ mb: 3 }}
              value={email}
              ref={userRef}
            />
            <TextField
              label="Password"
              onChange={e => setPassword(e.target.value)}
              variant="outlined"
              color="primary"
              type="password"
              fullWidth
              sx={{ mb: 3}}
              value={password}
            />
            <div style={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" type="submit">Login</Button>
            </div>
          </form>
        </Card>
      </div>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={2000}
        severity="success"
        variant="filled"
        onClose={()=>setSnackBarOpen(false)}
        message={snackBarMsg}
        action={snackBarAction}
      />
    </div>  
  )
}

export default Login;