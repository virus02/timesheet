import "./Login.css";
import { useState } from "react";
import Card from '@mui/material/Card';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');

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

    setEmailError(false);
    setPasswordError(false);

    if(email === '') {
      setEmailError(true);
    }

    if(password === '') {
      setPasswordError(true);
    }

    if(email && password) {
      await login();
    }
  }

  const login = async () => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    });
    const user = await response.json();
    sessionStorage.setItem('user', user.details);
    setSnackBarOpen(true);
    setSnackBarMsg("Login successfull !!!");
  }

  return(
    <div className="login-container">
      <div className="login-form-container">
        <Card sx={{ padding: "10px", height: "35vh", alignItems: "center" }} raised>
          <form onSubmit={handleSubmit}>
            <h2 style={{ textAlign: "center" }}>Login Form</h2>
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
              error={emailError}
            />
            <TextField
              label="Password"
              onChange={e => setPassword(e.target.value)}
              required
              variant="outlined"
              color="primary"
              type="password"
              fullWidth
              sx={{ mb: 3}}
              value={password}
              error={passwordError}
            />
            <Button variant="contained" color="primary" type="submit">Login</Button>
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