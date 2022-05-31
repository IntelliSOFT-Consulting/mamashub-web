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
import {CancelPresentationRounded,BiotechRounded, LibraryBooks, CheckRounded , AppRegistration}
 from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCookie } from '../lib/cookie';
import { Tooltip, IconButton, Avatar, Button, Container } from '@mui/material';
import { PivotTableChart, Dashboard, ListAlt, People, Settings, ScheduleSend, DocumentScanner } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
const drawerWidth = 250;

export default function HeaderDrawer({ children }) {

  let title = "Kabarak MHIS"
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#8A5EB5' }} elevation={0}>
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
                  sx={{ my: 2, color: '#8A5EB5', display: 'block' }}
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
        <Box sx={{ overflow: 'auto', backgroundColor: '#8A5EB5', color: 'white' }} >
          <List >
          <ListItem button onClick={e=>navigate('/')}>
                <ListItemIcon>
                  <Dashboard sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Dashboard' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          <Divider />
          <ListItem button onClick={e=>navigate('/moh-100')}>
                <ListItemIcon>
                  <DocumentScanner sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='CHV Referral Form' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          
          <ListItem button onClick={e=>navigate('/community-referrals')}>
                <ListItemIcon>
                  <ScheduleSend sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Community Referrals' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          </List>
          <Divider />
         
          <List>
          <ListItem button onClick={e=>navigate('/patient-registration')}>
                <ListItemIcon>
                  <AppRegistration sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Patient Registration' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>

         
          <ListItem button onClick={e=>navigate('/patient-profile')}>
                <ListItemIcon>
                  <LibraryBooks sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="ANC Profile" primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          <ListItem button onClick={e=>navigate('/physical-exam')}>
                <ListItemIcon>
                  <BiotechRounded sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Physical Exam" primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem><ListItem button onClick={e=>navigate('/close-anc-record')}>
                <ListItemIcon>
                  <CancelPresentationRounded sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Present Pregnancy Table" primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          <Divider />
          <ListItem button onClick={e=>navigate('/patients')}>
                <ListItemIcon>
                  <ListAlt sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Patients List' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          <Divider />
          <ListItem button onClick={e=>navigate('/patients')}>
                <ListItemIcon>
                  <PivotTableChart sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='MOH Reports' primaryTypographyProps={{fontSize:"13px"}}/>
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
                  <Settings sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary='Account & Settings' primaryTypographyProps={{fontSize:"13px"}}/>
          </ListItem>
          </List>
          <p></p>
          {/* <p></p> */}
          <br/>
          {/* <p></p> */}
          <p></p>
          {/* <p></p> */}
          <br/>

        
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
