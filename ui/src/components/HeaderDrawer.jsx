import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCookie } from '../lib/cookie';
import { Tooltip, IconButton, Avatar, MenuItem, Button } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const drawerWidth = 250;

export default function HeaderDrawer({ content }) {

  let title = "Human Milk Bank"
  let navigate = useNavigate()
  const settings = [{ 'My Account': '/my-account' }, { 'Logout': "/logout" },];

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (getCookie("token")) {
      return
    } else {
      navigate('/login')
      window.localStorage.setItem("next_page", "/")
      return
    }
  }, [])




  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#115987' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
           {title}
          </Typography>
          {getCookie("token") ? 
          (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
             
            </div>) : <Button variant="outlined" onClick={e => { navigate('/login') }} sx={{ color: "#115987" }}>LOGIN</Button>}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },

        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', backgroundColor: '#115987', color: 'white' }} >
          <List>
            {['Dashboard', 'Maternity Registration', 'Assesment', 'New Born'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  <Menu sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Post Natal', 'Human Milk Bank', 'Monitoring and Assessment', 'Patients List'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  <Menu sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText sx={{fontSize:'10px'}}  primary={text} />
              </ListItem>
            ))}
          </List>
          <br />
          <br />
          <br />
          <br />
          <br />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
