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
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCookie } from '../lib/cookie';
import { Tooltip, IconButton, Avatar, Button, Container } from '@mui/material';
import { AccountCircle, AppRegistration, BabyChangingStation, ChildCare, Dashboard, Kitchen, ListAlt, People, Settings } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
const drawerWidth = 250;

export default function HeaderDrawer({ children }) {

  let title = "Human Milk Bank"
  let navigate = useNavigate()
  const settings = [{ 'My Account': '/account' }, { 'Logout': "/logout" },];
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
    if(getCookie("token")) {
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
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                  <MenuItem key={Object.keys(setting)[0]} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center" onClick={e => { navigate(`${setting[Object.keys(setting)[0]]}`) }}>{Object.keys(setting)[0]}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box> : <Button variant="outlined" onClick={e => { navigate('/login') }} sx={{ color: "white" }}>LOGIN</Button>}
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
          <ListItem button onClick={e=>navigate('/')}>
                <ListItemIcon>
                  <Dashboard sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Dashboard' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          <ListItem button onClick={e=>navigate('/maternity-unit')}>
                <ListItemIcon>
                  <AppRegistration sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Maternity Unit' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          
          <ListItem button onClick={e=>navigate('/new-born-unit')}>
                <ListItemIcon>
                  <BabyChangingStation sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='New Born Unit' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          </List>
          <Divider />
         
          <List>
          <ListItem button onClick={e=>navigate('/post-natal-unit')}>
                <ListItemIcon>
                  <ChildCare sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Post Natal Unit' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>

          <ListItem button onClick={e=>navigate('/human-milk-bank')}>
                <ListItemIcon>
                  <Kitchen sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Human Milk Bank' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          <Divider />
          <ListItem button onClick={e=>navigate('/patients')}>
                <ListItemIcon>
                  <ListAlt sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Patients List' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          </List>
          <Divider />
          <List>
          <ListItem button onClick={e=>navigate('/users')}>
                <ListItemIcon>
                  <People sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Users' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          <ListItem button onClick={e=>navigate('/account')}>
                <ListItemIcon>
                  <AccountCircle sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='My Account' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          <ListItem button>
                <ListItemIcon>
                  <Settings sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Settings' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          </List>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <p></p>
          <p></p>

        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <br/>
      <br/>
      <br/>
      <Container>
        {children}
      </Container>
      </Box>
    </Box>
  );
}
