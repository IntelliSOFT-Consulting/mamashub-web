import {
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  Grid,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Container,
  useMediaQuery,
  Box,
  Snackbar,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from '../lib/cookie';
import { apiHost } from '../lib/api';
import referralForm from '../lib/forms/referral';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CurrentPatient from '../components/CurrentPatient';

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
}

export default function PatientList() {
  let [referrals, setReferrals] = useState([]);
  let navigate = useNavigate();
  let [selected, setSelected] = useState([]);
  let [open, setOpen] = useState(false);
  let [visit, setVisit] = useState();
  const [value, setValue] = useState('1');
  let [message, setMessage] = useState(false);

  let getReferrals = async () => {
    let data = await (
      await fetch(`${apiHost}/referrals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        },
      })
    ).json();
    console.log(data);
    if (data.status === 'success' && data.data.length > 0) {
      for (let v of data.data) {
        v.createdAt = timeSince(new Date(v.createdAt)) + ' ago';
        v.dob = timeSince(new Date(v.dob)) + ' old';
      }
    }
    setReferrals(data.data);
    return;
  };

  let previewReferral = async () => {
    if (selected.length === 1) {
      navigate(`/referral/${selected[0]}`);
      return;
    }
    return;
  };

  let deleteReferrals = async () => {};

  useEffect(() => {
    getReferrals();
  }, []);

  useEffect(() => {
    if (getCookie('token')) {
      return;
    } else {
      navigate('/login');
      window.localStorage.setItem('next_page', '/community-referrals');
      return;
    }
  }, []);

  const columns = [
    { field: 'lastName', headerName: 'Last Name', width: 250, editable: true },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 250,
      editable: true,
    },
    { field: 'dob', headerName: 'Age', width: 150 },
    { field: 'createdAt', headerName: 'Referral Time', width: 200 },
  ];

  let isMobile = useMediaQuery('(max-width:600px)');

  let args = qs.parse(window.location.search);
  // console.log(args)

  const sections = Object.keys(referralForm);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container sx={{ border: '1px white dashed' }}>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={''}
            message={message}
            key={'loginAlert'}
          />
          {visit && <CurrentPatient data={visit} />}

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                value={value}
                // onChange={handleChange}
                variant='scrollable'
                scrollButtons='auto'
                aria-label='scrollable auto tabs example'
              >
                <Tab label='Counselling' value='1' />
              </TabList>
            </Box>

            <TabPanel value='1'>
              {sections.map((section, index) => (
                <>
                  <Typography
                    variant='p'
                    sx={{ fontSize: 'large', fontWeight: 'bold' }}
                  >
                    {section}
                  </Typography>
                  <Divider />

                  <p />
                  <Grid container spacing={1} padding='1em'>
                    {referralForm[section].map((field, index) => {
                      switch (field.type) {
                        case 'text':
                          return (
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label={field.label}
                                variant='outlined'
                                name={field.name}
                              />
                            </Grid>
                          );
                        case 'radio':
                          return (
                            <Grid item xs={12} md={6}>
                              <FormControl component='fieldset'>
                                <FormLabel component='legend'>
                                  {field.label}
                                </FormLabel>
                                <RadioGroup
                                  aria-label={field.label}
                                  name={field.name}
                                  value={field.value}
                                  onChange={''}
                                >
                                  {field.options.map((option, index) => (
                                    <FormControlLabel
                                      value={option.label}
                                      control={<Radio />}
                                      label={option.value}
                                      key={index}
                                    />
                                  ))}
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                          );
                        case 'textarea':
                          return (
                            <Grid item xs={12} md={12}>
                              <TextField
                                fullWidth
                                label={field.label}
                                variant='outlined'
                                name={field.name}
                                multiline
                                rows={4}
                              />
                            </Grid>
                          );
                        default:
                          return null;
                      }
                    })}
                  </Grid>
                </>
              ))}

              <p></p>
              <Divider />
              <p></p>
              <Stack direction='row' spacing={2} alignContent='right'>
                {!isMobile && (
                  <Typography sx={{ minWidth: '80%' }}></Typography>
                )}
                <Button
                  variant='contained'
                  disableElevation
                  sx={{ backgroundColor: 'gray' }}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={e => {
                    // saveSuccessfully();
                  }}
                  disableElevation
                  sx={{ backgroundColor: '#632165' }}
                >
                  Save
                </Button>
              </Stack>
              <p></p>
            </TabPanel>
          </TabContext>
        </Container>
      </LocalizationProvider>
    </>
  );
}
