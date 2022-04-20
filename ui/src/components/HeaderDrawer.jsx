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
import { Tooltip, IconButton, Avatar, MenuItem, Button, Container } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
const drawerWidth = 250;

export default function HeaderDrawer({ children }) {

  let title = "Human Milk Bank"
  let navigate = useNavigate()
  const settings = [{ 'My Account': '/my-account' }, { 'Logout': "/logout" },];
  let pages = settings

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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#115987' }} elevation={0}>
        <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
              onClick={e => { navigate('/') }}
            >
              {title}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'inline-block' } }}>
              
             
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
              onClick={e => { navigate('/') }}
            >
              {title}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={Object.keys(page)[0]}
                  onClick={e => { navigate(`${page[Object.keys(page)[0]]}`); handleCloseNavMenu() }}
                  sx={{ my: 2, color: '#115987', display: 'block' }}
                >
                  {Object.keys(page)[0]}
                </Button>
              ))}
            </Box>
            {getCookie("token") ? <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Avatar" src="/avatar.png" />
              </IconButton>
            </Tooltip>
            {/* <Menu
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
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box> : <Button variant="outlined" onClick={e => { navigate('/login') }} sx={{ color: "#115987" }}>LOGIN</Button>}
        </Toolbar>
        </Container>
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
          <List >
            {['Dashboard', 'Maternity Registration', 'Assessment', 'Post Natal Unit'].map((text, index) => (
              <ListItem button key={text} >
                <ListItemIcon>
                  <Menu sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={text} primaryTypographyProps={{fontSize:"13px"}}/>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['New Born Unit', 'Human Milk Bank', 'Monitoring & Assessment', 'Patients List'].map((text, index) => (
              <ListItem sx={{fontSize:'10px'}} button key={text}>
                <ListItemIcon>
                  <Menu sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={text} primaryTypographyProps={{fontSize:"13px"}}/>
              </ListItem>
            ))}
          </List>

          <List>
            {['Users', 'My Account', 'Settings'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  <Menu sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={text} primaryTypographyProps={{fontSize:"13px"}} />
              </ListItem>
            ))}
          </List>

        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <br/>
      <br/>
      <br/>
      <br/>
        {children}
      </Box>
    </Box>
  );
}
