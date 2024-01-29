import { useEffect, useState, } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { axiosPrivate } from '../../api/axios';

function EditActivity() {

  const { activityname } = useParams();
  console.log(activityname);
  const [name, setName] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [nameErr, setNameErr] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axiosPrivate(`http://localhost:3000/api/activity/getactivity?name=${activityname}`)
        const result = await response.data;
        let activity = result.details;
        console.log(activity);
        setName(activity.name);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchActivity();

  }, [activityname]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setNameErr(false);
    setIsLoading(true);

    if(!name) {
      setNameErr(true);
    }

    if(name) {
      let data = {
        name: name,
      }
      axiosPrivate.patch('/activity/editactivity', data)
      .then((response)=> {
        setSnackBarOpen(true);
        setSnackBarMsg("Activity has been updated");
        setIsLoading(false);
        setName('');
        navigate('/projectlist');
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

  return(
    <div className="edit-user-container">
      { !isLoading ?
        <div className="edit-user-form-container">
          <Card sx={{ padding: "10px", height: "30vh", alignItems: "center" }} raised>
          <h2 style={{ textAlign: "center" }}>UPDATE USER</h2>
          <form onSubmit={handleSubmit}>
              <TextField
                label="Activity name"
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
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '5px' }}>
                <Button style={{ marginTop: '10px', width: '30%' }} variant="contained" color="primary" type="submit">Submit</Button>
                <Button style={{ marginTop: '10px', width: '30%' }} variant="contained" color="error" onClick={() => navigate('/activitylist')}>Cancel</Button>
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

export default EditActivity;