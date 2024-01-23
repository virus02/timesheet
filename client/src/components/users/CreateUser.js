import "./CreateUser.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'ABC',
  'DEF',
  'GHI',
  'JKL',
  'MNO'
];

function CreateUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [fullNameErr, setFullNameErr] = useState(false);
  const [roleErr, setRoleErr] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [departmentErr, setDepartmentErr] = useState(false);
  const [projectErr, setProjectErr] = useState(false);
  
  const handleSubmit = (event) => {
    event.preventDefault();

    setFullNameErr(false);
    setRoleErr(false);
    setPasswordErr(false);
    setEmailErr(false);
    setDepartmentErr(false);
    setProjectErr(false);
    setIsLoading(true);

    if(!fullName) {
      setFullNameErr(true);
    }
    if(!role) {
      setRoleErr(true);
    }
    if(!email) {
      setEmailErr(true);
    }
    if(!password) {
      setPasswordErr(true);
    }
    if(!department) {
      setDepartmentErr(true);
    }
    if(project.length === 0) {
      setProjectErr(true);
    }

    let url = 'http://localhost:3000/api/user/'

    if(fullName && password && email && department && project.length > 0) {
      let data = {
        fullName: fullName,
        password: password,
        role: role,
        email: email,
        department: department,
        projects: project
      }
      axios.post(url + 'createuser', data)
      .then((response)=> {
        setSnackBarOpen(true);
        setSnackBarMsg("User has been created");
        setIsLoading(false);
        setFullName('');
        setRole('');
        setEmail('');
        setPassword('');
        setDepartment('');
        setProject([]);
        navigate('/userlist');
      })
      .catch((error) => {
        setSnackBarOpen(true);
        setSnackBarMsg("Something went wrong!!!");
      });
    }
  }

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

  const handleRoleSelect = (event) => {
    setRole(event.target.value);
  }

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setProject(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  return(
    <div className="create-user-container">
      { !isLoading ?
        <div className="create-user-form-container">
          <Card sx={{ padding: "10px", height: "72vh", alignItems: "center" }} raised>
          <h2 style={{ textAlign: "center" }}>Create User</h2>
          <form onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                onChange={e => setFullName(e.target.value)}
                required
                variant="outlined"
                color="primary"
                type="text"
                sx={{ mb: 3 }}
                fullWidth
                value={fullName}
                error={fullNameErr}
              />
              {/* <InputLabel id="role-label">Role</InputLabel> */}
              <Select
                labelId="role-label"
                value={role}
                fullWidth
                onChange={handleRoleSelect}
                sx={{ mb: 3 }}
                error={roleErr}
              >
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={0}>User</MenuItem>
              </Select>
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
                error={emailErr}
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
                error={passwordErr}
              />
              <TextField
                label="Department"
                onChange={e => setDepartment(e.target.value)}
                required
                variant="outlined"
                color="primary"
                type="text"
                fullWidth
                sx={{ mb: 3 }}
                value={department}
                error={departmentErr}
              />
              <Select
                value={project}
                displayEmpty
                multiple
                onChange={handleSelectChange}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                error={projectErr}
                fullWidth
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={project.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Button style={{ marginTop: '10px', width: '30%' }} variant="contained" color="primary" type="submit">Submit</Button>
                <Button style={{ marginTop: '10px', width: '30%' }} variant="contained" color="error" onClick={() => navigate('/userlist')}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div> :
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      }
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={()=>setSnackBarOpen(false)}
        message={snackBarMsg}
        action={snackBarAction}
        key={'topcenter'}
      />
    </div>
  )

}

export default CreateUser;