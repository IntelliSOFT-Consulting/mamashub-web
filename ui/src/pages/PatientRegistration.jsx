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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Checkbox,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Patient } from '../lib/fhir/resources';
import { v4 as uuidv4 } from 'uuid';
import { FhirApi, apiHost } from './../lib/api';
import * as qs from 'query-string';
import { DataGrid } from '@mui/x-data-grid';

import counties from '../data/counties.json';
import countyMap from '../data/code_to_counties_map.json';
import subCountyMap from '../data/code_to_constituencies_map.json';
import wardMap from '../data/code_to_wards_map.json';
import countyToConstituency from '../data/county_to_consituencies.json';
import consituencyToWard from '../data/consituencies_to_ward.json';
import { startVisit } from '../lib/startVisit';
import { createEncounter } from '../lib/api';
import useInput from '../hooks/useInput';
import patientRegistrationFields from '../lib/forms/patientRegistration';
import Preview from '../components/Preview';

export default function PatientRegistration({ userData }) {
  let [patient, setPatient] = useState({});
  let [open, setOpen] = useState(false);
  let [data, setData] = useState({});
  let [message, setMessage] = useState(false);
  let [constituencies, setConstituency] = useState([]);
  let [wards, setWards] = useState();
  let [patients, setPatients] = useState({});
  const [preview, setPreview] = useState(false);
  let navigate = useNavigate();
  let [observations, setObservations] = useState({});
  let isMobile = useMediaQuery('(max-width:600px)');
  const [value, setValue] = useState('1');

  const { inputs, handleInputChange, setInputs } = useInput({});

  const geneRateAncCode = () => {
    let ancCode = '';
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    ancCode = `${year}-${month}-${day}${hour}`;
    return ancCode;
  };

  function prompt(text) {
    setMessage(text);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 4000);
    return;
  }

  let displayAlert = async message => {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
    return;
  };

  //   useEffect(() => {}, [patient.dob]);

  useEffect(() => {
    if (userData) {
      const { facilityName, kmhflCode } = userData;
      console.log(userData)
      const generatedAncCode = geneRateAncCode();
      setInputs({
        ...inputs,
        facilityName,
        kmhflCode,
        ancCode: generatedAncCode,
      });

    }
  }, [userData]);

  useEffect(() => {
    let _edd = new Date(observations.lmp ? observations.lmp : new Date());
    _edd.setDate(_edd.getDate() + 36 * 7);
    console.log(_edd);
    setObservations({ ...observations, edd: _edd.toLocaleDateString('en-GB') });
    return;
  }, [observations.lmp]);

  useEffect(() => {
    if (getCookie('token')) {
      window.localStorage.setItem('activeTab', 'patient-registration');
      return;
    } else {
      navigate('/login');
      window.localStorage.setItem('next_page', '/patient-registration');
      return;
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    return;
  };

  let registerPatient = async () => {
    try {
      let id = uuidv4();
      let response = await FhirApi({
        url: `/fhir/Patient/${id}`,
        method: 'PUT',
        data: JSON.stringify(Patient({ ...inputs, id: id })),
      });
      console.log(response);
      if (response.status === 'success') {
        setOpen(false);
        setMessage('Patient created successfully');
        setOpen(true);
      }
      //Create Encounter
      let patientId = id;
      //create encounter
      let encounter = await createEncounter(patientId, 'MATERNAL_PROFILE');
      console.log(encounter);

      //Create and Post Observations
      let res = await (
        await fetch(`${apiHost}/crud/observations`, {
          method: 'POST',
          body: JSON.stringify({
            patientId: patientId,
            encounterId: encounter,
            observations: JSON.stringify({
              ...observations,
              physicalAddress: `${inputs.county}, ${inputs.subCounty}, ${inputs.ward}, ${inputs.estate}`,
            }),
          }),
          headers: { 'Content-Type': 'application/json' },
        })
      ).json();

      if (res.status === 'success') {
        prompt('Patient created successfully');
        navigate(`/patients/${id}`);
        return;
      } else {
        prompt(res.error);
        return;
      }
    } catch (error) {
      setOpen(true);
      console.log(error);
      setMessage(String(error));
      return;
    }
  };

  useEffect(() => {
    if (getCookie('token')) {
      return;
    } else {
      navigate('/login');
      window.localStorage.setItem('next_page', '/patient-registration');
      return;
    }
  }, []);

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
          {preview ? (
            <Preview
              title='Patient Registration Preview'
              format={patientRegistrationFields}
              data={{ ...inputs, ...observations }}
              close={() => setPreview(false)}
              submit={registerPatient}
            />
          ) : (
            <>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    value={value}
                    onChange={handleChange}
                    variant='scrollable'
                    scrollButtons='auto'
                    aria-label='scrollable auto tabs example'
                  >
                    <Tab label='Client Registration' value='1' />
                  </TabList>
                </Box>
                <TabPanel value='1'>
                  <Typography
                    variant='p'
                    sx={{ fontSize: 'large', fontWeight: 'bold' }}
                  >
                    Facility Details
                  </Typography>
                  <Divider />
                  <Grid container spacing={1} padding='.5em'>
                    <Grid item xs={12} md={12} lg={6}>
                      <TextField
                        fullWidth='80%'
                        type='text'
                        label='Name of Facility'
                        placeholder='Name of Facility'
                        name='facilityName'
                        size='small'
                        disabled
                        value={inputs.facilityName}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      <TextField
                        fullWidth='80%'
                        type='text'
                        value={inputs.kmhflCode}
                        label='KMHFL Code'
                        placeholder='KMHFL Code'
                        name='kmhflCode'
                        size='small'
                        disabled
                        InputLabelProps={{ shrink: true }}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <p />
                  <Typography
                    variant='p'
                    sx={{ fontSize: 'large', fontWeight: 'bold' }}
                  >
                    Client Details
                  </Typography>
                  <Divider />
                  <Grid container spacing={1} padding='.5em'>
                    <Grid item xs={12} md={12} lg={4}>
                      <TextField
                        fullWidth='80%'
                        type='text'
                        label='ANC Code'
                        InputLabelProps={{ shrink: true }}
                        placeholder='ANC Code'
                        name='ancCode'
                        value={inputs.ancCode}
                        size='small'
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <TextField
                        fullWidth='80%'
                        type='text'
                        label='PNC No'
                        placeholder='PNC No'
                        value={inputs.pncNo}
                        name='pncNumber'
                        size='small'
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} padding='.5em'>
                    <Grid item xs={12} md={12} lg={4}>
                      <TextField
                        fullWidth='80%'
                        type='text'
                        label='Name of Client'
                        value={inputs.name}
                        placeholder='Name of Client'
                        name='names'
                        size='small'
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      {!isMobile ? (
                        <DesktopDatePicker
                          label='Date of birth'
                          inputFormat='dd/MM/yyyy'
                          value={inputs.dob || null}
                          name='dob'
                          onChange={e => {
                            handleInputChange({ dob: e });
                          }}
                          renderInput={params => (
                            <TextField {...params} size='small' fullWidth />
                          )}
                        />
                      ) : (
                        <MobileDatePicker
                          label='Date of birth'
                          inputFormat='dd/MM/yyyy'
                          name='dob'
                          value={inputs.dob || null}
                          onChange={e => {
                            handleInputChange({ dob: e });
                          }}
                          renderInput={params => (
                            <TextField {...params} size='small' fullWidth />
                          )}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <TextField
                        fullWidth='100%'
                        type='phone'
                        label='Phone Number'
                        placeholder='Phone Number'
                        value={inputs.phoneNumber}
                        size='small'
                        onChange={e => {
                          setObservations({
                            ...observations,
                            patientPhoneNumber: e.target.value,
                          });
                          handleInputChange({
                            patientPhoneNumber: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} padding='.5em'>
                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                          Education Level
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={inputs.educationLevel}
                          label='Education Level'
                          onChange={e => {
                            setObservations({
                              ...observations,
                              educationLevel: e.target.value,
                            });
                          }}
                          size='small'
                          defaultValue={'Primary School'}
                        >
                          <MenuItem value={'Primary School'}>
                            Primary School
                          </MenuItem>
                          <MenuItem value={'High School'}>High School</MenuItem>
                          <MenuItem value={'Undergraduate'}>
                            Undergraduate
                          </MenuItem>
                          <MenuItem value={'Postgraduate'}>
                            Postgraduate
                          </MenuItem>
                          <MenuItem value={'Tertiary'}>Tertiary</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                          Marital Status
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={inputs.maritalStatus}
                          label='Marital Status'
                          onChange={e => {
                            setObservations({
                              ...observations,
                              maritalStatus: e.target.value,
                            });
                          }}
                          size='small'
                          defaultValue={'Single'}
                        >
                          <MenuItem value={'Single'}>Single</MenuItem>
                          <MenuItem value={'Married'}>Married</MenuItem>
                          <MenuItem value={'Divorced'}>Divorced</MenuItem>
                          <MenuItem value={'Widowed'}>Widowed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Divider />
                  <p></p>
                  <Typography
                    variant='p'
                    sx={{ fontSize: 'large', fontWeight: 'bold' }}
                  >
                    Residence
                  </Typography>
                  <Divider />
                  <Grid container spacing={1} padding='.5em'>
                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                          County
                        </InputLabel>
                        <Select
                          // defaultValue={null}
                          label='County'
                          name='county'
                          onChange={e => {
                            setInputs({ ...inputs, county: e.target.value });
                            let countyCode = counties.find(
                              county => county.name === e.target.value
                            ).code;

                            let consituencies =
                              countyToConstituency[countyCode];
                            setConstituency(consituencies);
                          }}
                          size='small'
                        >
                          {counties &&
                            counties.map(county => {
                              return (
                                <MenuItem key={county.code} value={county.name}>
                                  {county.name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                          Sub-County
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={inputs.constituency}
                          label='Sub-County'
                          name='subCounty'
                          onChange={e => {
                            setInputs({ ...inputs, subCounty: e.target.value });
                            let consituencyCode = constituencies.find(
                              consituency => consituency.name === e.target.value
                            ).code;
                            const wards = consituencyToWard[consituencyCode];
                            setWards(wards);
                          }}
                          disabled={!inputs.county}
                          size='small'
                        >
                          {inputs.county &&
                            constituencies?.map(subCounty => {
                              return (
                                <MenuItem
                                  key={subCounty.code}
                                  value={subCounty.name}
                                >
                                  {subCounty.name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                          Ward
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={inputs.ward}
                          label='Ward'
                          name='ward'
                          onChange={handleInputChange}
                          size='small'
                        >
                          {inputs.subCounty &&
                            wards.map(ward => {
                              return (
                                <MenuItem key={ward.code} value={ward.code}>
                                  {ward.name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12} lg={4}>
                      <TextField
                        fullWidth='100%'
                        type='text'
                        label='Estate'
                        placeholder='Estate'
                        name='estate'
                        size='small'
                        value={inputs.estate}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <p></p>
                  <Divider />
                  <p></p>
                  <Typography
                    variant='p'
                    sx={{ fontSize: 'large', fontWeight: 'bold' }}
                  >
                    Next of kin
                  </Typography>
                  <Divider />
                  <Grid container spacing={1} padding='.5em'>
                    <Grid item xs={12} md={12} lg={4}>
                      <TextField
                        fullWidth='100%'
                        type='text'
                        label='Next of kin names'
                        placeholder='Next of kin names'
                        size='small'
                        name='nextOfKinName'
                        value={inputs.nextOfKinName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                          Relationship
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          name='nextOfKinRelationship'
                          value={
                            inputs.nextOfKinRelationship
                              ? inputs.nextOfKinRelationship
                              : ''
                          }
                          label='Relationship'
                          onChange={handleInputChange}
                          size='small'
                        >
                          <MenuItem value={'Spouse'}>Spouse</MenuItem>
                          <MenuItem value={'Child'}>Child</MenuItem>
                          <MenuItem value={'Parent'}>Parent</MenuItem>
                          <MenuItem value={'Relatives'}>Relatives</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <TextField
                        fullWidth='100%'
                        type='text'
                        label="Next of Kin's contact/phone no."
                        placeholder="Next of Kin's contact/phone no."
                        name='nextOfKinPhone'
                        size='small'
                        value={inputs.nextOfKinPhone}
                        onChange={e => {
                          setInputs({
                            ...inputs,
                            nextOfKinPhone: e.target.value,
                          });
                          setObservations({
                            ...observations,
                            contactPhoneNumber: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Divider />
                  <p />
                  <Typography
                    variant='p'
                    sx={{ fontSize: 'large', fontWeight: 'bold' }}
                  >
                    Clinical Information
                  </Typography>
                  <Grid container spacing={1} padding='.5em'>
                    <Grid container spacing={1} item xs={12} md={12} lg={6}>
                      <Grid item xs={12} md={12} lg={4}>
                        <TextField
                          fullWidth='80%'
                          type='text'
                          label='Gravida'
                          placeholder='Gravida'
                          name='gravidae'
                          size='small'
                          value={observations.gravidae}
                          onChange={e => {
                            setObservations({
                              ...observations,
                              gravidae: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={4}>
                        <TextField
                          fullWidth='80%'
                          type='text'
                          label='Parity'
                          placeholder='Parity'
                          size='small'
                          value={observations.parity}
                          onChange={e => {
                            setObservations({
                              ...observations,
                              parity: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2}>
                      <TextField
                        fullWidth='80%'
                        type='text'
                        label='Height(cm)'
                        placeholder='Height(cm)'
                        size='small'
                        value={observations.height}
                        onChange={e => {
                          setObservations({
                            ...observations,
                            bodyHeight: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={2}>
                      <TextField
                        fullWidth='80%'
                        type='text'
                        label='Weight (kg)'
                        placeholder='Weight (kg)'
                        size='small'
                        value={observations.weight}
                        onChange={e => {
                          setObservations({
                            ...observations,
                            bodyWeight: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} padding='.5em'>
                    <Grid item xs={12} md={12} lg={4}>
                      {!isMobile ? (
                        <DesktopDatePicker
                          label='LMP'
                          inputFormat='dd/MM/yyyy'
                          value={observations.lmp || null}
                          onChange={e => {
                            console.log(e);
                            setObservations({ ...observations, lmp: e });
                          }}
                          renderInput={params => (
                            <TextField {...params} size='small' fullWidth />
                          )}
                        />
                      ) : (
                        <MobileDatePicker
                          label='LMP'
                          inputFormat='dd/MM/yyyy'
                          value={observations.lmp || null}
                          onChange={e => {
                            console.log(e);
                            setObservations({ ...observations, lmp: e });
                          }}
                          renderInput={params => (
                            <TextField {...params} size='small' fullWidth />
                          )}
                        />
                      )}
                    </Grid>
                    {observations.lmp && (
                      <Grid item xs={12} md={12} lg={4}>
                        <TextField
                          fullWidth='80%'
                          type='text'
                          value={observations.edd ? observations.edd : null}
                          label='EDD'
                          placeholder='EDD'
                          size='small'
                          onChange={e => {
                            setObservations({
                              ...observations,
                              edd: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                    )}
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
                      disableElevation
                      onClick={() => setPreview(true)}
                      sx={{ backgroundColor: '#632165' }}
                    >
                      Save
                    </Button>
                  </Stack>
                  <p></p>
                </TabPanel>
              </TabContext>
            </>
          )}
        </Container>
      </LocalizationProvider>
    </>
  );
}
