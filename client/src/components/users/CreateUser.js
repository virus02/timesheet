import "./CreateUser.css";
import { useEffect, useState } from "react";
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
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from "@mui/material/CircularProgress";
import Box  from "@mui/material/Box";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

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

const roles = [
  'Admin',
  'User'
]

function CreateUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState([]);
  const [names, setNames] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [fullNameErr, setFullNameErr] = useState(false);
  const [roleErr, setRoleErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [departmentErr, setDepartmentErr] = useState(false);
  const [projectErr, setProjectErr] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getProjects = async () => {
      try {
        if(isMounted) {
          console.log('inside');
          setIsLoading(true);
          console.log('API request started');

          const response = await axiosPrivate.get('/project/projectlist');

          const projects = response.data.map(ele => ele.name);
          setNames(projects);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setIsLoading(false);
      }
    };

    getProjects();

    return () => {
      isMounted = false;
    };
  }, [axiosPrivate]);
  
  const handleSubmit = async (event) => {
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

    if(fullName && password && email && department && project.length > 0) {
      let data = {
        fullName: fullName,
        password: password,
        role: role,
        email: email,
        department: department,
        projects: project
      }

      try {
        await axiosPrivate.post('/user/createuser', data);
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
      } catch(err) {
        console.error(err);
        setSnackBarOpen(true);
        setSnackBarMsg("Something went wrong!!!");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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
      { !isLoading ? (
        <div className="create-user-form-container">
          <Card sx={{ padding: "10px", height: "80vh", alignItems: "center" }} raised>
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
              <InputLabel id="role-checkbox-label" style={{ float: 'left' }}>Role</InputLabel>
              <Select
                value={role}
                fullWidth
                onChange={handleRoleSelect}
                sx={{ mb: 3 }}
                label="role"
                error={roleErr}
              >
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
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
              <InputLabel id="project-checkbox-label" style={{ float: 'left' }}>Projects</InputLabel>
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
                    <Checkbox checked={ project.indexOf(name) > -1 } />
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
        </div> )
        :(
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        )
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