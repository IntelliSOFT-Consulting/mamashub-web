import {
  Container,
  TextField,
  Stack,
  Button,
  Grid,
  Snackbar,
  Typography,
  Divider,
  useMediaQuery,
  Radio,
  RadioGroup,
  Alert,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CurrentPatient from '../components/CurrentPatient';

export default function PMTCTInterventions() {
  let [patient, setPatient] = useState({});
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [notes, setNotes] = useState('');
  let preventiveServicesList = {
    '1st injection': 'First visit',
    '2nd injection': '4 weeks after 1st dose but 2 weeks before childbirth',
    '3rd injection': '6 months after 2nd dose',
    '4th injection': '1 year after 3rd injection / subsequent pregnancy',
    '5th injection': '1 year after 4th injection / subsequent pregnancy',
  };
  let malariaProphylaxisList = {
    'Upto 12 weeks': '-',
    '13-16 weeks': 'IPTp - SP dose 1',
    '20 weeks': 'IPTp - SP dose 2',
    '26 weeks': 'IPTp - SP dose 3',
    '30 weeks': 'IPTp - SP dose 4',
    '34 weeks': 'IPTp - SP dose 5',
    '36 weeks': 'No SP, if last dose received <1 Month ago',
    '38 weeks': 'IPTp - SP dose 6 (if no dose in past month)',
    '40 weeks': '-',
  };

  let ifasList = {
    '0 - Upto 12 weeks gestation': '60 tablets',
    '1 - 12 weeks gestation': '56 tablets',
    '2 - 20 weeks gestation': '42 tablets',
    '3 - 26 weeks gestation': '28 tablets',
    '4 - 30 weeks gestation': '28 tablets',
    '5 - 34 weeks gestation': '14 tablets',
    '6 - 36 weeks gestation': '14 tablets',
    '7 - 38 weeks gestation': '14 tablets',
    '8 - 40 weeks gestation': '14 tablets',
  };

  let [serologyList, setSerologyList] = useState([]);
  let [malariaProphylaxis, setMalariaProphylaxis] = useState();
  let [preventiveServiceList, setPreventiveServiceList] = useState([]);
  let [visit, setVisit] = useState();
  let [notesDisplay, setNotesDisplay] = useState('');
  let [data, setData] = useState({});
  let [preventiveServices, setPreventiveServices] = useState({});
  let [preventiveService, setPreventiveService] = useState(null);
  let [maternalSerology, setMaternalSerology] = useState({});
  let [ifas, setIfas] = useState();
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery('(max-width:600px)');

  const [value, setValue] = useState('1');

  let saveSerologyResults = async () => {
    return;
  };

  let saveSuccessfully = async () => {
    setMessage('Data saved successfully');
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    let visit = window.localStorage.getItem('currentPatient');
    if (!visit) {
      return;
    }
    setVisit(JSON.parse(visit));
    return;
  }, []);

  let saveObservation = async (patientId, code, observationValue) => {
    let response = await await fetch('/crud/observations', {
      body: JSON.stringify({}),
    });

    return;
  };

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
                onChange={handleChange}
                variant='scrollable'
                scrollButtons='auto'
                aria-label='scrollable auto tabs example'
              >
                <Tab label='PMTCT Interventions' value='1' />
              </TabList>
            </Box>

            {/* PMTCT Interventions */}
            <TabPanel value='1'>
              <Typography
                variant='p'
                sx={{ fontSize: 'large', fontWeight: 'bold' }}
              >
                Intervention Given
              </Typography>
              <Divider />

              <p></p>
              <Grid container spacing={1} padding='1em'>
                <Grid item xs={12} md={6}>
                  <FormControl component='fieldset' variant='standard'>
                    <FormLabel component='legend'>Intervention given</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        label='ART for life'
                        control={
                          <Checkbox
                            onChange={e => {
                              setPreventiveServices({
                                ...preventiveServices,
                                interventionGiven: e,
                              });
                            }}
                            name='ART for life'
                          />
                        }
                      />
                      <FormControlLabel
                        label='Viral load(VL) sample'
                        control={
                          <Checkbox
                            onChange={e => {
                              setPreventiveServices({
                                ...preventiveServices,
                                interventionGiven: e,
                              });
                            }}
                            name='Viral load(VL) sample'
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <p></p>
              <Divider />
              <Typography
                variant='p'
                sx={{ fontSize: 'large', fontWeight: 'bold' }}
              >
                ART for life
              </Typography>

              <Grid container spacing={1} padding='1em'>
                <Grid item xs={12} md={12} lg={6}>
                  {!isMobile ? (
                    <DesktopDatePicker
                      label='If yes, date started'
                      inputFormat='MM/dd/yyyy'
                      value={
                        preventiveServices.dateGiven
                          ? preventiveServices.dateGiven
                          : new Date()
                      }
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          dateGiven: e,
                        });
                      }}
                      renderInput={params => (
                        <TextField {...params} size='small' fullWidth />
                      )}
                    />
                  ) : (
                    <MobileDatePicker
                      label='If yes, date started'
                      inputFormat='MM/dd/yyyy'
                      value={
                        preventiveServices.dateGiven
                          ? preventiveServices.dateGiven
                          : new Date()
                      }
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          dateGiven: e,
                        });
                      }}
                      renderInput={params => (
                        <TextField {...params} size='small' fullWidth />
                      )}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={12} lg={8}>
                  <Typography variant='p'>
                    Regimen (select all that apply)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={6} padding='.5em'>
                  <Grid xs={12} lg={12}>
                    <FormControl component='fieldset' variant='standard'>
                      <FormGroup>
                        <FormControlLabel
                          label='Dolutegravir'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Dolutegravir'
                            />
                          }
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} padding='.5em'>
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='Amount'
                      placeholder='Amount'
                      size='small'
                      onChange={e => {
                        setPreventiveServices({
                          dolutegravirAmount: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} padding='.5em'>
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='Dosage'
                      placeholder='Dosage'
                      size='small'
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          dolutegravirDosage: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} padding='.5em'>
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='Dosage'
                      placeholder='Frequency'
                      size='small'
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          dolutegravirFrequency: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} lg={6} padding='.5em'>
                  <Grid xs={12} lg={12}>
                    <FormControl component='fieldset' variant='standard'>
                      <FormLabel component='legend'></FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          label='Emitricitabine'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  emitricitabine: e,
                                });
                              }}
                              name='Emitricitabine'
                            />
                          }
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} padding='.5em'>
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='Amount'
                      placeholder='Amount'
                      size='small'
                      onChange={e => {
                        setPreventiveServices({
                          emitricitabineAmount: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} padding='.5em'>
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='Dosage'
                      placeholder='Dosage'
                      size='small'
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          emitricitabineDosage: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} padding='.5em'>
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='Dosage'
                      placeholder='Frequency'
                      size='small'
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          emitricitabineFrequency: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} lg={6} padding='.5em'>
                  <Grid xs={12} lg={12}>
                    <FormControl component='fieldset' variant='standard'>
                      <FormGroup>
                        <FormControlLabel
                          label='Tenofovoir alafenamide fumarate'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Tenofovoir alafenamide fumarate'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Zidovudine'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Zidovudine'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Keloids'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Keloids'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Lamivudine'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Lamivudine'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Nevirapine'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Nevirapine'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Efavirenz'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Efavirenz'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Other'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Other'
                            />
                          }
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} padding='.5em'>
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='If Other, please specify'
                      placeholder='If Other, please specify'
                      size='small'
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          other: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid container space={1} padding='1em'>
                <Grid item xs={12} md={12} lg={7}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setPreventiveServices({
                        ...preventiveServices,
                        regimenChanged: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Was the regimen changed? '
                    />
                    <FormControlLabel
                      value={'Yes'}
                      control={<Radio />}
                      label='Yes'
                    />
                    <FormControlLabel
                      value={'No'}
                      control={<Radio />}
                      label='No'
                    />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} md={12} lg={6} padding='.5em'>
                  <Grid xs={12} lg={12}>
                    <FormControl component='fieldset' variant='standard'>
                      <FormLabel component='legend'>
                        If yes, give reason (select all thet apply)
                      </FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          label='Change in viral load'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Change in viral load'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Adverse reactions'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Adverse reactions'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Interation with another drug concomitantly used'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Interation with another drug concomitantly used'
                            />
                          }
                        />
                        <FormControlLabel
                          label='Pregnancy trimester'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Pregnancy trimester'
                            />
                          }
                        />

                        <FormControlLabel
                          label='Other'
                          control={
                            <Checkbox
                              onChange={e => {
                                setPreventiveServices({
                                  ...preventiveServices,
                                  interventionGiven: e,
                                });
                              }}
                              name='Other'
                            />
                          }
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} padding='.5em'>
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='If Other, please specify'
                      placeholder='If Other, please specify'
                      size='small'
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          other: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <p></p>

              <Divider />

              <p></p>
              <Typography
                variant='p'
                sx={{ fontSize: 'large', fontWeight: 'bold' }}
              >
                Viral Load (VL) Sample
              </Typography>
              <Grid container spacing={1} padding='.5em'>
                <Grid item xs={12} md={12} lg={6}>
                  {!isMobile ? (
                    <DesktopDatePicker
                      label='If yes, date viral load was taken'
                      inputFormat='MM/dd/yyyy'
                      value={
                        preventiveServices.dateGiven
                          ? preventiveServices.dateGiven
                          : new Date()
                      }
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          dateGiven: e,
                        });
                      }}
                      renderInput={params => (
                        <TextField {...params} size='small' fullWidth />
                      )}
                    />
                  ) : (
                    <MobileDatePicker
                      label='If yes, date viral load was taken'
                      inputFormat='MM/dd/yyyy'
                      value={
                        preventiveServices.dateGiven
                          ? preventiveServices.dateGiven
                          : new Date()
                      }
                      onChange={e => {
                        setPreventiveServices({
                          ...preventiveServices,
                          dateGiven: e,
                        });
                      }}
                      renderInput={params => (
                        <TextField {...params} size='small' fullWidth />
                      )}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <TextField fullWidth='90%' label='Results' size='small' type='number' />
                </Grid>
              </Grid>
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
                    saveSuccessfully();
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
