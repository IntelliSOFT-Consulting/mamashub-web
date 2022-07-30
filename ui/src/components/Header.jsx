import { useState, useEffect } from 'react'
import { AppBar, Typography, Box, Toolbar, Button, Tooltip, Menu, MenuItem, IconButton, Avatar, Container, } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu';
import { getCookie } from '../lib/cookie';


export default function Header({ children }) {
  let title = "Mama's Hub"
  let pages = [
    { 'My Account': "/account" },
    { 'MOH-100': '/moh-100' },
    { 'Patients List': '/patients' },
    { 'Registration': '/patient-registration' },
    { 'Confirm Pregnancy': '/confirm-pregancy' },
    { 'Physical Exam': '/physical-exam' },
    { 'Close ANC Record': '/present-pregnancy-table' },
    { 'Logout': '/logout' }
  ]
  let navigate = useNavigate()
  const settings = [{ 'My Account': '/account' }, { 'Logout': "/logout" },];

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
    <>
      <AppBar position="fixed" sx={{ color: 'white', backgroundColor: '#632165' }}>
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
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'block' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={Object.keys(page)[0]} onClick={handleCloseNavMenu} sx={{ color: "#632165" }}>
                    <Typography textAlign="center" onClick={e => { navigate(`${page[Object.keys(page)[0]]}`) }}>{Object.keys(page)[0]}</Typography>
                  </MenuItem>
                ))}
              </Menu>
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
            </Box> : <Button variant="outlined" onClick={e => { navigate('/login') }} sx={{ color: "#632165" }}>LOGIN</Button>}
          </Toolbar>
        </Container>
      </AppBar>
      <br /><br /><br />
      <Container>
        {children}
      </Container>
    </>
  )
}




