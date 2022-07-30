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
import { CancelPresentationRounded, BiotechRounded, LibraryBooks, CheckRounded, AppRegistration, MedicationRounded }
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

  let title = "Mama's Hub"
  let navigate = useNavigate()
  const settings = [{ 'My Account': '/account' }, { 'Logout': "/logout" },];
  let pages = settings
  let [activeTab, setActiveTab] = useState("dashboard")

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

  let isActiveTab = (tab) => {
    return tab === activeTab
  }

  let activateTab = (tab) => {
    window.localStorage.setItem("activeTab", tab)
    return
  }

  useEffect(() => {
    setActiveTab(window.localStorage.getItem("activeTab"))

  }, [window.localStorage.getItem("activeTab")])




  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#632165' }} elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
          <img onClick={e => { navigate('/') }} src="/landing_page.png" height="50px" alt="logo"/>
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
                  sx={{ my: 2, color: '#632165', display: 'block' }}
                >
                  {Object.keys(page)[0]}
                </Button>
              ))}
            </Box>
            {getCookie("token") ? <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar  />
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
        <Box sx={{ overflow: 'auto', backgroundColor: '#632165', }} >
          <List >
            <ListItem button onClick={e => { navigate('/'); activateTab("dashboard") }} sx={{ backgroundColor: isActiveTab("dashboard") ? "white" : '#632165', color: isActiveTab("dashboard") ? '#632165' : "white" }}>
              <ListItemIcon>
                <Dashboard sx={{ color: isActiveTab("dashboard") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Dashboard' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <Divider />
            <ListItem button onClick={e => { navigate('/moh-100'); activateTab("moh-100") }} sx={{ backgroundColor: isActiveTab("moh-100") ? "white" : '#632165', color: isActiveTab("moh-100") ? '#632165' : "white" }} >
              <ListItemIcon>
                <DocumentScanner sx={{ color: isActiveTab("moh-100") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='CHW Referral Form' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { navigate('/community-referrals'); activateTab("community-referrals") }} sx={{ backgroundColor: isActiveTab("community-referrals") ? "white" : '#632165', color: isActiveTab("community-referrals") ? '#632165' : "white" }}>
              <ListItemIcon>
                <ScheduleSend sx={{ color: isActiveTab("community-referrals") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Community Referrals' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={e => { activateTab("patient-registration"); navigate('/patient-registration') }} sx={{ backgroundColor: isActiveTab("patient-registration") ? "white" : '#632165', color: isActiveTab("patient-registration") ? '#632165' : "white" }}>
              <ListItemIcon>
                <AppRegistration sx={{ color: isActiveTab("patient-registration") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Patient Registration' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { activateTab("patient-profile"); navigate('/patient-profile') }} sx={{ backgroundColor: isActiveTab("patient-profile") ? "white" : '#632165', color: isActiveTab("patient-profile") ? '#632165' : "white" }}>
              <ListItemIcon>
                <LibraryBooks sx={{ color: isActiveTab("patient-profile") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="ANC Profile" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { activateTab("physical-exam"); navigate('/physical-exam') }} sx={{ backgroundColor: isActiveTab("physical-exam") ? "white" : '#632165', color: isActiveTab("physical-exam") ? '#632165' : "white" }}>
              <ListItemIcon>
                <BiotechRounded sx={{ color: isActiveTab("physical-exam") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Physical Exam" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { activateTab("counselling-treatment"); navigate('/counselling-treatment') }} sx={{ backgroundColor: isActiveTab("counselling-treatment") ? "white" : '#632165', color: isActiveTab("counselling-treatment") ? '#632165' : "white" }}>
              <ListItemIcon>
                <MedicationRounded sx={{ color: isActiveTab("counselling-treatment") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Counselling & Treatment" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { activateTab("present-pregnancy-table"); navigate('/present-pregnancy-table') }} sx={{ backgroundColor: isActiveTab("present-pregnancy-table") ? "white" : '#632165', color: isActiveTab("present-pregnancy-table") ? '#632165' : "white" }}>
              <ListItemIcon>
                <CancelPresentationRounded sx={{ color: isActiveTab("present-pregnancy-table") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Present Pregnancy Table" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <Divider />
            <ListItem button onClick={e => { activateTab("patients"); navigate('/patients') }} sx={{ backgroundColor: isActiveTab("patients") ? "white" : '#632165', color: isActiveTab("patients") ? '#632165' : "white" }}>
              <ListItemIcon>
                <ListAlt sx={{ color: isActiveTab("patients") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Patients List' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <Divider />
            <ListItem button onClick={e => { activateTab("moh-reports"); navigate('/moh-reports') }} sx={{ backgroundColor: isActiveTab("moh-reports") ? "white" : '#632165', color: isActiveTab("moh-reports") ? '#632165' : "white" }}>
              <ListItemIcon>
                <PivotTableChart sx={{ color: isActiveTab("moh-reports") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='MOH Reports' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={e => { activateTab("users"); navigate('/users') }} sx={{ backgroundColor: isActiveTab("users") ? "white" : '#632165', color: isActiveTab("users") ? '#632165' : "white" }}>
              <ListItemIcon>
                <People sx={{ color: isActiveTab("users") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Users' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { activateTab("account"); navigate('/account') }} sx={{ backgroundColor: isActiveTab("account") ? "white" : '#632165', color: isActiveTab("account") ? '#632165' : "white" }}>
              <ListItemIcon>
                <Settings sx={{ color: isActiveTab("account") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Account & Settings' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
          </List>
          <p></p>
          {/* <p></p> */}
          <br />
          {/* <p></p> */}
          <p></p>
          {/* <p></p> */}
          <br />


        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <br />
        <br />
        <br />
        <Container>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
