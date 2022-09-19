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
import { CancelPresentationRounded, BiotechRounded, LibraryBooks, CheckRounded, AppRegistration, MedicationRounded, Vaccines, PestControlRounded, AccessTimeRounded, Bloodtype, MedicationLiquidRounded, Domain }
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
  let [role, setRole] = useState(null)
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

  let getProfile = async () => {
    let data = (await (await fetch("/auth/me",
      {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
      })).json())
    console.log(data)
    setRole(data.data.role)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    let token = getCookie("token")
    if (token) {
      getProfile();
      return
    } else {
      navigate('/login')
      // window.localStorage.setItem("next_page", "/")
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
            <img onClick={e => { navigate('/') }} src="/landing_page.png" height="50px" alt="logo" />
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
                  <Avatar />
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
            </Box> : <Button variant="outlined" onClick={e => { navigate('/login') }} sx={{ color: "white", "&:hover": { backgroundColor: "gray" } }}>LOGIN</Button>}
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
            <ListItem button onClick={e => { navigate('/'); activateTab("dashboard") }} sx={{ backgroundColor: isActiveTab("dashboard") ? "white" : '#632165', color: isActiveTab("dashboard") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <Dashboard sx={{ color: isActiveTab("dashboard") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Dashboard' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <Divider />
            <ListItem button onClick={e => { navigate('/moh-100'); activateTab("moh-100") }} sx={{ backgroundColor: isActiveTab("moh-100") ? "white" : '#632165', color: isActiveTab("moh-100") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }} >
              <ListItemIcon>
                <DocumentScanner sx={{ color: isActiveTab("moh-100") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='CHW Referral Form' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { navigate('/community-referrals'); activateTab("community-referrals") }} sx={{ backgroundColor: isActiveTab("community-referrals") ? "white" : '#632165', color: isActiveTab("community-referrals") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <ScheduleSend sx={{ color: isActiveTab("community-referrals") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Community Referrals' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={e => { activateTab("patient-registration"); navigate('/patient-registration') }} sx={{ backgroundColor: isActiveTab("patient-registration") ? "white" : '#632165', color: isActiveTab("patient-registration") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <AppRegistration sx={{ color: isActiveTab("patient-registration") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Patient Registration' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { activateTab("patients"); navigate('/patients') }} sx={{ backgroundColor: isActiveTab("patients") ? "white" : '#632165', color: isActiveTab("patients") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <ListAlt sx={{ color: isActiveTab("patients") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Patients List' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <ListItem button onClick={e => { activateTab("antenatal-profile"); navigate('/antenatal-profile') }} sx={{ backgroundColor: isActiveTab("antenatal-profile") ? "white" : '#632165', color: isActiveTab("antenatal-profile") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <LibraryBooks sx={{ color: isActiveTab("antenatal-profile") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Antenatal Profile" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("medical-surgical-history"); navigate('/medical-surgical-history') }} sx={{ backgroundColor: isActiveTab("medical-surgical-history") ? "white" : '#632165', color: isActiveTab("medical-surgical-history") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <BiotechRounded sx={{ color: isActiveTab("medical-surgical-history") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Medical & Surgical History" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("physical-exam"); navigate('/physical-exam') }} sx={{ backgroundColor: isActiveTab("physical-exam") ? "white" : '#632165', color: isActiveTab("physical-exam") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <BiotechRounded sx={{ color: isActiveTab("physical-exam") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Physical Examination" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("birth-plan"); navigate('/birth-plan') }} sx={{ backgroundColor: isActiveTab("birth-plan") ? "white" : '#632165', color: isActiveTab("birth-plan") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <MedicationRounded sx={{ color: isActiveTab("birth-plan") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Birth Plan" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("previous-pregnancy"); navigate('/previous-pregnancy') }} sx={{ backgroundColor: isActiveTab("previous-pregnancy") ? "white" : '#632165', color: isActiveTab("previous-pregnancy") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <CancelPresentationRounded sx={{ color: isActiveTab("previous-pregnancy") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Previous Pregnancy" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("present-pregnancy"); navigate('/present-pregnancy') }} sx={{ backgroundColor: isActiveTab("present-pregnancy") ? "white" : '#632165', color: isActiveTab("present-pregnancy") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <AccessTimeRounded sx={{ color: isActiveTab("present-pregnancy") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Present Pregnancy" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("tetanus-diptheria"); navigate('/tetanus-diptheria') }} sx={{ backgroundColor: isActiveTab("tetanus-diptheria") ? "white" : '#632165', color: isActiveTab("tetanus-diptheria") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <Vaccines sx={{ color: isActiveTab("tetanus-diptheria") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Tetanus & Diptheria" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("malaria-prophylaxis"); navigate('/malaria-prophylaxis') }} sx={{ backgroundColor: isActiveTab("malaria-prophylaxis") ? "white" : '#632165', color: isActiveTab("malaria-prophylaxis") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <PestControlRounded sx={{ color: isActiveTab("malaria-prophylaxis") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Malaria Prophylaxis" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("maternal-serology"); navigate('/maternal-serology') }} sx={{ backgroundColor: isActiveTab("maternal-serology") ? "white" : '#632165', color: isActiveTab("maternal-serology") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <Bloodtype sx={{ color: isActiveTab("maternal-serology") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Maternal Serology" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("deworming"); navigate('/deworming') }} sx={{ backgroundColor: isActiveTab("deworming") ? "white" : '#632165', color: isActiveTab("deworming") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <MedicationRounded sx={{ color: isActiveTab("deworming") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Deworming" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("ifas"); navigate('/ifas') }} sx={{ backgroundColor: isActiveTab("ifas") ? "white" : '#632165', color: isActiveTab("ifas") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <MedicationLiquidRounded sx={{ color: isActiveTab("ifas") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="IFAS" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("pmtct-interventions"); navigate('/pmtct-interventions') }} sx={{ backgroundColor: isActiveTab("pmtct-interventions") ? "white" : '#632165', color: isActiveTab("pmtct-interventions") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <CancelPresentationRounded sx={{ color: isActiveTab("pmtct-interventions") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="PMTCT Interventions" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>

            <ListItem button onClick={e => { activateTab("counselling"); navigate('/counselling') }} sx={{ backgroundColor: isActiveTab("counselling") ? "white" : '#632165', color: isActiveTab("counselling") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <CancelPresentationRounded sx={{ color: isActiveTab("counselling") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Counselling" primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
            <Divider />

            <ListItem button onClick={e => { activateTab("moh-reports"); navigate('/moh-reports') }} sx={{ backgroundColor: isActiveTab("moh-reports") ? "white" : '#632165', color: isActiveTab("moh-reports") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <PivotTableChart sx={{ color: isActiveTab("moh-reports") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='MOH Reports' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
          </List>
          <Divider />
          <List>
            {(role === "ADMINISTRATOR" || role === "FACILITY_ADMINISTRATOR") && <ListItem button onClick={e => { activateTab("users"); navigate('/users') }} sx={{ backgroundColor: isActiveTab("users") ? "white" : '#632165', color: isActiveTab("users") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <People sx={{ color: isActiveTab("users") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Users' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>}
            {(role === "ADMINISTRATOR") && <ListItem button onClick={e => { activateTab("facilities"); navigate('/facilities') }} sx={{ backgroundColor: isActiveTab("facilities") ? "white" : '#632165', color: isActiveTab("facilities") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <Domain sx={{ color: isActiveTab("facilities") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Facilities' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>}
            <ListItem button onClick={e => { activateTab("account"); navigate('/account') }} sx={{ backgroundColor: isActiveTab("account") ? "white" : '#632165', color: isActiveTab("account") ? '#632165' : "white", "&:hover": { backgroundColor: "gray" } }}>
              <ListItemIcon>
                <Settings sx={{ color: isActiveTab("account") ? "#632165" : 'white' }} />
              </ListItemIcon>
              <ListItemText primary='Account & Settings' primaryTypographyProps={{ fontSize: "13px" }} />
            </ListItem>
          </List>
          <p></p>
          <br />
          <p></p>



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
