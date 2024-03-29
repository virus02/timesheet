import './EditUser.css';
import { useEffect, useState, } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import { axiosPrivate } from '../../api/axios';

const roles = [
  {id: 1, name:'Admin'},
  {id: 0, name: 'User'}
];

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

function EditUser() {

  const { email } = useParams();
  const [fullName, setFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState([]);

  const [fullNameErr, setFullNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [departmentErr, setDepartmentErr] = useState(false);
  const [projectErr, setProjectErr] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosPrivate(`http://localhost:3000/api/user/getuser?email=${email}`)
        const result = await response.data;
        let user = result.details;
        console.log(user);
        setFullName(user.fullName);
        setEditEmail(user.email);
        setDepartment(user.department);
        setProject(user.projects);
        setRole(user.role)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchUser();

  }, [email]);

  useEffect(() => {
    let isMounted = true;

    const getProjects = async () => {
      try {
        if(isMounted) {
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
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    setFullNameErr(false);
    setEmailErr(false);
    setDepartmentErr(false);
    setProjectErr(false);
    setIsLoading(true);

    if(!fullName) {
      setFullNameErr(true);
    }
    if(!email) {
      setEmailErr(true);
    }
    if(!department) {
      setDepartmentErr(true);
    }
    if(project.length === 0) {
      setProjectErr(true);
    }

    if(fullName && email && department && project.length > 0) {
      let data = {
        fullName: fullName,
        email: email,
        role: role,
        department: department,
        projects: project
      }
      axiosPrivate.patch('/user/edituser', data)
      .then((response)=> {
        setSnackBarOpen(true);
        setSnackBarMsg("User has been created");
        setIsLoading(false);
        setFullName('');
        setEditEmail('');
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

  return(
    <div className="edit-user-container">
      { !isLoading ?
        <div className="edit-user-form-container">
          <Card sx={{ padding: "10px", height: "70vh", alignItems: "center" }} raised>
          <h2 style={{ textAlign: "center" }}>UPDATE USER</h2>
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
              <TextField
                label="Email"
                onChange={e => setEditEmail(e.target.value)}
                required
                variant="outlined"
                color="primary"
                type="email"
                fullWidth
                sx={{ mb: 3 }}
                value={editEmail}
                error={emailErr}
              />
              <InputLabel id="role-checkbox-label" style={{ float: 'left' }}>Role</InputLabel>
              <Select
                value={role}
                fullWidth
                onChange={handleRoleSelect}
                sx={{ mb: 3 }}
              >
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id} selected={roles.indexOf(role) > -1}>
                    {r.name}
                  </MenuItem>
                ))}
              </Select>
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
              <InputLabel id="role-checkbox-label" style={{ float: 'left' }}>Projects</InputLabel>
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
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '5px' }}>
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

export default EditUser;