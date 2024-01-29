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

function EditProject() {

  const { projectname } = useParams();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [activity, setActivity] = useState([]);
  const [activityNames, setActivityNames] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [nameErr, setNameErr] = useState(false);
  const [descErr, setDescErr] = useState(false);
  const [activityErr, setActivityErr] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosPrivate(`http://localhost:3000/api/project/getproject?name=${projectname}`)
        const result = await response.data;
        let project = result.details;
        console.log(project);
        setName(project.name);
        setDesc(project.description);
        setActivity(project.activity);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchUser();

  }, [projectname]);

  useEffect(() => {
    let isMounted = true;

    const activities = async () => {
      try {
        if(isMounted) {
          setIsLoading(true);
          console.log('API request started');

          const response = await axiosPrivate.get('/activity/activitylist');

          const activityName = response.data.map(ele => ele.name);
          setActivityNames(activityName);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setIsLoading(false);
      }
    };

    activities();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    setNameErr(false);
    setDescErr(false);
    setActivityErr(false);
    setIsLoading(true);

    if(!name) {
      setNameErr(true);
    }
    if(!desc) {
      setDescErr(true);
    }
    if(activity.length > 0) {
      setActivityErr(true);
    }

    if(name && desc && activity.length > 0) {
      let data = {
        name: name,
        description: desc,
        activity: activity
      }
      axiosPrivate.patch('/project/editproject', data)
      .then((response)=> {
        setSnackBarOpen(true);
        setSnackBarMsg("Project has been updated");
        setIsLoading(false);
        setName('');
        setDesc('');
        setActivity([]);
        navigate('/projectlist');
      })
      .catch((error) => {
        setSnackBarOpen(true);
        setSnackBarMsg("Something went wrong!!!");
      });
    }
  }

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setActivity(
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
          <Card sx={{ padding: "10px", height: "50vh", alignItems: "center" }} raised>
          <h2 style={{ textAlign: "center" }}>UPDATE USER</h2>
          <form onSubmit={handleSubmit}>
              <TextField
                label="Project name"
                onChange={e => setName(e.target.value)}
                required
                variant="outlined"
                color="primary"
                type="text"
                sx={{ mb: 3 }}
                fullWidth
                value={name}
                error={nameErr}
              />
              <TextField
                label="Description"
                onChange={e => setDesc(e.target.value)}
                required
                variant="outlined"
                color="primary"
                type="email"
                fullWidth
                sx={{ mb: 3 }}
                value={desc}
                error={descErr}
              />
              <InputLabel id="role-checkbox-label" style={{ float: 'left' }}>Activitites</InputLabel>
              <Select
                value={activity}
                displayEmpty
                multiple
                onChange={handleSelectChange}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                error={activityErr}
                fullWidth
              >
                {activityNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={activity.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '5px' }}>
                <Button style={{ marginTop: '10px', width: '30%' }} variant="contained" color="primary" type="submit">Submit</Button>
                <Button style={{ marginTop: '10px', width: '30%' }} variant="contained" color="error" onClick={() => navigate('/projectlist')}>Cancel</Button>
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

export default EditProject;