import "./Header.css";
import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Toolbar } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const settings = ['Logout'];

function Header() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    await axiosPrivate.post('/logout');
    navigate('/login');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: 1,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              LOGO
            </Typography>
            <Tooltip title="Activities">
              <IconButton onClick={() => navigate('/activitylist')} sx={{ p: 0, cursor: 'pointer', marginRight: '30px' }}>
                <InventoryOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Projects">
              <IconButton onClick={() => navigate('/projectlist')} sx={{ p: 0, cursor: 'pointer', marginRight: '30px' }}>
                <ListAltOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Users">
              <IconButton onClick={() => navigate('/userlist')} sx={{ p: 0, cursor: 'pointer', marginRight: '30px' }}>
                <PeopleOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, cursor: 'pointer' }}>
                <AccountCircleOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={setting === 'Logout' ? handleLogout : ''}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header;