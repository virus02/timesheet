import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box  from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CreateActivity() {
  const [name, setName] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [nameErr, setNameErr] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setNameErr(false);

    if(!name) {
      setNameErr(true);
    }

    if(name) {
      let data = {
        name: name
      }

      try {
        await axiosPrivate.post('/activity/createactivity', data);
        setSnackBarOpen(true);
        setSnackBarMsg("Activity has been created");
        setIsLoading(false);
        setName('');
        navigate('/projectlist');
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

  return(
    <div className="create-user-container">
      { !isLoading ? (
        <div className="create-user-form-container">
          <Card sx={{ padding: "10px", height: "30vh", alignItems: "center" }} raised>
          <h2 style={{ textAlign: "center" }}>CREATE ACTIVITY</h2>
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
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Button style={{ marginTop: '50px', width: '30%' }} variant="contained" color="primary" type="submit">Submit</Button>
                <Button style={{ marginTop: '50px', width: '30%' }} variant="contained" color="error" onClick={() => navigate('/activitylist')}>Cancel</Button>
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

export default CreateActivity;