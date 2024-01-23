import "./Login.css";
import { useState } from "react";
import Card from '@mui/material/Card';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleSubmit = (event) => {
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
      console.log(email, password);
    }
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
    </div>  
  )
}

export default Login;