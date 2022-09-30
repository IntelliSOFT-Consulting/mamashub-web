import {
  Container,
  Modal,
  CircularProgress,
  FormGroup,
  Checkbox,
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
  Card,
  CardContent,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { v4 as uuidv4 } from 'uuid';
import { createEncounter, FhirApi, apiHost } from '../lib/api';
import CurrentPatient from '../components/CurrentPatient';

export default function AntenatalProfile() {
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [data, setData] = useState({});
  let [message, setMessage] = useState(false);
  let [observations, setObservations] = useState([]);
  let isMobile = useMediaQuery('(max-width:600px)');
  let [antenatalProfile, setAntenatalProfile] = useState({});
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);
  let [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState('1');

  function prompt(text) {
    setMessage(text);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 4000);
    return;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    return;
  };
  const handleChanges = event => {
    console.log(event);
    return;
  };

  let saveAntenatalProfile = async () => {
    //get current patient
    if (!visit) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }

    try {
      //create Encounter
      let patient = visit.id;
      let encounter = await createEncounter(patient, 'ANTENATAL_PROFILE');
      console.log(encounter);

      //Create and Post Observations
      let res = await (
        await fetch(`${apiHost}/crud/observations`, {
          method: 'POST',
          body: JSON.stringify({
            patientId: patient,
            encounterId: encounter,
            observations: antenatalProfile,
          }),
          headers: { 'Content-Type': 'application/json' },
        })
      ).json();
      console.log(res);

      if (res.status === 'success') {
        prompt('Antenatal Profile saved successfully');
        navigate(`/patient/${patient}`);
        return;
      } else {
        prompt(res.error);
        return;
      }
    } catch (error) {
      console.error(error);
      // prompt(JSON.stringify(error))
      return;
    }
  };

  let saveBirthPlan = async () => {
    //get current patient
    let patient = visit.id;
    if (!patient) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }

    //create encounter
    let encounter = await createEncounter(patient, 'BIRTH-PLAN');
    console.log(encounter);

    //save observations
    let observationsList = [];
    //Create and Post Observations
    let res = await (
      await fetch(`${apiHost}/crud/observations`, {
        method: 'POST',
        body: JSON.stringify({
          patientId: patient,
          encounterId: encounter,
          observations: antenatalProfile,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    ).json();
    console.log(res);

    if (res.status === 'success') {
      prompt('Birth Plan saved successfully');
      return;
    } else {
      prompt(res.error);
      return;
    }
  };

  useEffect(() => {
    let visit = window.localStorage.getItem('currentPatient');
    if (!visit) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }
    setVisit(JSON.parse(visit));
    return;
  }, []);

  useEffect(() => {
    if (getCookie('token')) {
      return;
    } else {
      window.localStorage.setItem('next_page', '/antenatal-profile');
      navigate('/login');
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
          {visit && <CurrentPatient data={visit} />}
          <form>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  value={value}
                  onChange={handleChange}
                  variant='scrollable'
                  scrollButtons='auto'
                  aria-label='scrollable auto tabs example'
                >
                  <Tab label='Antenatal Profile' value='1' />
                </TabList>
              </Box>
              <TabPanel value='1'>
                {/* <p></p> */}
                <Typography variant='h6'>Blood Tests</Typography>
                <Divider />
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      defaultChecked={true}
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          hbTest: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        // sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Hb Test: '
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.hbTest &&
                      antenatalProfile.hbTest === 'Yes' && (
                        <>
                          <FormControlLabel
                            value={0}
                            control={<FormLabel />}
                            label='If yes, specify reading: '
                          />
                          <TextField
                            type='text'
                            placeholder='If yes, specify reading'
                            size='small'
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                hbTestReading: e.target.value,
                              });
                            }}
                          />
                        </>
                      )}
                  </Grid>
                </Grid>

                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          bloodGroupTest: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        //   sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Blood Group Test: '
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

                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.bloodGroupTest === 'Yes' && (
                      <RadioGroup
                        row
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            bloodGroup: e.target.value,
                          });
                        }}
                      >
                        <FormControlLabel
                          value={0}
                          sx={{ width: '50%' }}
                          control={<FormLabel />}
                          label='Blood Group: '
                        />
                        <Grid xs={6} md={6} lg={6}>
                          <FormControlLabel
                            value='A'
                            control={<Radio />}
                            label='A'
                            width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={6}>
                          <FormControlLabel
                            value='B'
                            control={<Radio />}
                            label='B'
                            width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={6}>
                          <FormControlLabel
                            value='AB'
                            control={<Radio />}
                            label='AB'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={6}>
                          <FormControlLabel
                            value='O'
                            control={<Radio />}
                            label='O'
                          />
                        </Grid>
                      </RadioGroup>
                    )}
                  </Grid>
                </Grid>

                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          rhesusTest: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        //   sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Rhesus Test: '
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.rhesusTest === 'Yes' && (
                      <RadioGroup
                        row
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            rhesusFactor: e.target.value,
                          });
                        }}
                      >
                        <FormControlLabel
                          value={0}
                          //   sx={{ width: '30%' }}
                          control={<FormLabel />}
                          label='If yes specify rhesus factor: '
                        />
                        <FormControlLabel
                          value={'Rh Positive'}
                          control={<Radio />}
                          label='Rh Positive'
                        />
                        <FormControlLabel
                          value={'Rh Negative'}
                          control={<Radio />}
                          label='Rh Negative'
                        />
                      </RadioGroup>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          bloodRBSTest: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        control={<FormLabel />}
                        label='Blood RBS Test: '
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.bloodRBSTest === 'Yes' && (
                      <>
                        <FormControlLabel
                          value={0}
                          control={<FormLabel />}
                          label='If yes, RBS reading: '
                        />
                        <TextField
                          type='text'
                          placeholder='If yes, RBS reading'
                          size='small'
                          onChange={e => {
                            setAntenatalProfile({
                              ...antenatalProfile,
                              bloodRBSReading: e.target.value,
                            });
                          }}
                        />
                      </>
                    )}
                  </Grid>
                </Grid>
                <Divider />
                <p></p>
                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  Urine Test
                </Typography>

                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          urineTest: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        control={<FormLabel />}
                        label='Urinalysis Test'
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.urineTest === 'Yes' && (
                      <RadioGroup
                        row
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            urineTestResultsAbnormality: e.target.value,
                          });
                        }}
                      >
                        <FormControlLabel
                          value={0}
                          control={<FormLabel />}
                          label='If yes, test results: '
                        />
                        <FormControlLabel
                          value={'Normal'}
                          control={<Radio />}
                          label='Normal'
                        />
                        <FormControlLabel
                          value={'Abnormal'}
                          control={<Radio />}
                          label='Abnormal'
                        />
                      </RadioGroup>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} lg={7}>
                  {antenatalProfile.urineTestResultsAbnormality ===
                    'Abnormal' && (
                    <TextField
                      fullWidth='90%'
                      type='text'
                      label='If abnormal, state the abnormality: '
                      placeholder='If abnormal, state the abnormality: '
                      size='small'
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          urinalysisTestAbnormality: e.target.value,
                        });
                      }}
                    />
                  )}
                </Grid>

                <Divider />
                <p></p>

                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  TB Screening
                </Typography>

                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          tbScreening: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='TB Screening: '
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.tbScreening === 'Yes' && (
                      <RadioGroup
                        row
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            tbScreeningResults: e.target.value,
                          });
                        }}
                      >
                        <FormControlLabel
                          value={0}
                          sx={{ width: '50%' }}
                          control={<FormLabel />}
                          label='If yes, TB Results: '
                        />
                        <FormControlLabel
                          value={'Positive'}
                          control={<Radio />}
                          label='Positive'
                        />
                        <FormControlLabel
                          value={'Negative'}
                          control={<Radio />}
                          label='Negative'
                        />
                      </RadioGroup>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  {antenatalProfile.tbScreeningResults === 'Positive' && (
                    <Grid item xs={12} md={12} lg={6}>
                      <TextField
                        fullWidth='90%'
                        type='text'
                        label='If positive, send for TB Diagnosis'
                        placeholder='If positive, send for TB Diagnosis'
                        size='small'
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            specificDrugAllergies: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.tbScreeningResults === 'Negative' && (
                      <TextField
                        fullWidth='90%'
                        type='text'
                        label='If negative, give IPT as per eligibility'
                        placeholder='If negative, give IPT as per eligibility'
                        size='small'
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            specificDrugAllergies: e.target.value,
                          });
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    {!isMobile ? (
                      <DesktopDatePicker
                        label='IPT Date given'
                        inputFormat='MM/dd/yyyy'
                        value={antenatalProfile.iptDateGiven || null}
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            iptDateGiven: e,
                          });
                        }}
                        renderInput={params => (
                          <TextField {...params} size='small' fullWidth />
                        )}
                      />
                    ) : (
                      <MobileDatePicker
                        label='IPT Date given'
                        inputFormat='MM/dd/yyyy'
                        value={antenatalProfile.iptDateGiven || null}
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            iptDateGiven: e,
                          });
                        }}
                        renderInput={params => (
                          <TextField {...params} size='small' fullWidth />
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    {!isMobile ? (
                      <DesktopDatePicker
                        label='IPT next visit'
                        inputFormat='MM/dd/yyyy'
                        value={antenatalProfile.iptNextVisit || null}
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            iptNextVisit: e,
                          });
                        }}
                        renderInput={params => (
                          <TextField {...params} size='small' fullWidth />
                        )}
                      />
                    ) : (
                      <MobileDatePicker
                        label='IPT next visit'
                        inputFormat='MM/dd/yyyy'
                        value={antenatalProfile.iptNextVisit || null}
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            iptNextVisit: e,
                          });
                        }}
                        renderInput={params => (
                          <TextField {...params} size='small' fullWidth />
                        )}
                      />
                    )}
                  </Grid>
                </Grid>

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
                    onClick={e => {
                      setAntenatalProfile({});
                    }}
                  >
                    CANCEL
                  </Button>
                  {/* <Button
                    variant='contained'
                    onClick={e => {
                      saveAntenatalProfile();
                    }}
                    disableElevation
                    sx={{ backgroundColor: '#632165' }}
                  >
                    Save
                  </Button> */}
                  <Button
                    variant='contained'
                    onClick={e => {
                      handleChange(null, '2');
                    }}
                    disableElevation
                    sx={{ backgroundColor: '#632165' }}
                  >
                    NEXT
                  </Button>
                </Stack>
                <p></p>
              </TabPanel>

              <TabPanel value='2'>
                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  Multiple Babies
                </Typography>
                <Divider />
                <p></p>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          multipleBabies: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Multiple babies: '
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.multipleBabies === 'Yes' && (
                      <TextField
                        fullWidth='90%'
                        type='text'
                        size='small'
                        label='If yes, input number'
                        placeholder='If yes, input number'
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            numberOfBabies: e.target.value,
                          });
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
                <Divider />
                <p></p>
                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  Obstetric Ultrasound
                </Typography>

                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          firstObstetricUltrasound: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='1st Obstetric Ultrasound: '
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.firstObstetricUltrasound === 'Yes' && (
                      <>
                        {!isMobile ? (
                          <DesktopDatePicker
                            label='Date performed'
                            inputFormat='MM/dd/yyyy'
                            value={
                              antenatalProfile.firstObstetricUltrasoundDate ||
                              null
                            }
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                firstObstetricUltrasoundDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label='Date Performed'
                            inputFormat='MM/dd/yyyy'
                            value={
                              antenatalProfile.firstObstetricUltrasoundDate ||
                              null
                            }
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                firstObstetricUltrasoundDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          secondObstetricUltrasound: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='2nd Obstetric Ultrasound: '
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.secondObstetricUltrasound === 'Yes' && (
                      <>
                        {!isMobile ? (
                          <DesktopDatePicker
                            label='Date performed'
                            inputFormat='MM/dd/yyyy'
                            value={
                              antenatalProfile.secondObstetricUltrasoundDate ||
                              null
                            }
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                secondObstetricUltrasoundDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label='Date Performed'
                            inputFormat='MM/dd/yyyy'
                            value={
                              antenatalProfile.secondObstetricUltrasoundDate ||
                              null
                            }
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                secondObstetricUltrasoundDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
                <Divider />
                <p></p>
                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  HIV Status
                </Typography>

                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          hivStatus: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        control={<FormLabel />}
                        label='HIV Status before 1st ANC visit: '
                      />
                      <Grid container spacing={1} padding='.5em'>
                        <Grid xs={6} md={6} lg={3}>
                          <FormControlLabel
                            value='N'
                            control={<Radio />}
                            label='N'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={3}>
                          <FormControlLabel
                            value='U'
                            control={<Radio />}
                            label='U'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={6}>
                          <FormControlLabel
                            value='KP'
                            control={<Radio />}
                            label='KP'
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} md={12} lg={6}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>
                        ART eligibility (WHO stage)
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={antenatalProfile.artEligibility}
                        label='ART eligibility (WHO stage)'
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            artEligibility: e.target.value,
                          });
                        }}
                        size='small'
                      >
                        <MenuItem value={''}></MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          partnerHivStatus: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        control={<FormLabel />}
                        label='Partner HIV Status: '
                      />
                      <Grid container spacing={1} padding='.5em'>
                        <Grid xs={6} md={6} lg={3}>
                          <FormControlLabel
                            value='N'
                            control={<Radio />}
                            label='N'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={3}>
                          <FormControlLabel
                            value='U'
                            control={<Radio />}
                            label='U'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={6}>
                          <FormControlLabel
                            value='KP'
                            control={<Radio />}
                            label='KP'
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </Grid>
                </Grid>
                <>
                  {antenatalProfile.hivStatus === 'KP' && (
                    <>
                      <Divider />
                      <p></p>
                      <Typography
                        variant='p'
                        sx={{ fontSize: 'large', fontWeight: 'bold' }}
                      >
                        Maternal HAART
                      </Typography>

                      <Grid container spacing={1} padding='1em'>
                        <Grid item xs={12} md={12} lg={6}>
                          <FormControl fullWidth>
                            <InputLabel id='demo-simple-select-label'>
                              On ARV before first ANC visit
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              value={antenatalProfile.onArvBeforeFirstVisit}
                              label='On ARV before first ANC visit'
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  onArvBeforeFirstVisit: e.target.value,
                                });
                              }}
                              size='small'
                            >
                              <MenuItem value={''}></MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6}>
                          <FormControl fullWidth>
                            <InputLabel id='demo-simple-select-label'>
                              Started HAART in ANC
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              value={antenatalProfile.startedHaartInAnc}
                              label='Started HAART in ANC'
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  startedHaartInAnc: e.target.value,
                                });
                              }}
                              size='small'
                            >
                              <MenuItem value={''}></MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6}>
                          <FormControl fullWidth>
                            <InputLabel id='demo-simple-select-label'>
                              Clotrimoxazole given
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              value={antenatalProfile.clotrimoxazoleGiven}
                              label='Clotrimoxazole given'
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  clotrimoxazoleGiven: e.target.value,
                                });
                              }}
                              size='small'
                            >
                              <MenuItem value={''}></MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
                <Divider />
                <p></p>
                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  HIV Testing
                </Typography>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          hivTest: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='HIV test: '
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
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.hivTest === 'Yes' && (
                      <>
                        {!isMobile ? (
                          <DesktopDatePicker
                            label='If yes, date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.dateOfTest || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                dateOfTest: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label='If yes, date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.dateOfTest || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                dateOfTest: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} md={12} lg={6} />
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.hivTest === 'Yes' && (
                      <>
                        {!isMobile ? (
                          <DesktopDatePicker
                            label='If NR, select the next date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.nrDateOfTest || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                nrDateOfTest: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label='If NR, select the next date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.nrDateOfTest || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                nrDateOfTest: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          motherHivStatus: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='HIV status of mother: '
                      />
                      <Grid container spacing={1} padding='.5em'>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='R'
                            control={<Radio />}
                            label='R'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='Inconclusive'
                            control={<Radio />}
                            label='Inconclusive'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='NR'
                            control={<Radio />}
                            label='NR'
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.motherHivStatus === 'R' && (
                      <>
                        {!isMobile ? (
                          <DesktopDatePicker
                            label='If yes, date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.motherHivTestDate || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                motherHivTestDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label='If yes, date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.motherHivTestDate || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                motherHivTestDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>

                {/* syphilis testing */}
                <Divider />
                <p></p>
                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  Syphillis Testing
                </Typography>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          syphillisTest: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Syphillis test: '
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
                  <>
                    {antenatalProfile.syphillisTest === 'Yes' && (
                      <Grid item xs={12} md={12} lg={6}>
                        <>
                          {!isMobile ? (
                            <DesktopDatePicker
                              label='If yes, date of test'
                              inputFormat='MM/dd/yyyy'
                              value={
                                antenatalProfile.dateOfSyphillisTest || null
                              }
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  dateOfSyphillisTest: e,
                                });
                              }}
                              renderInput={params => (
                                <TextField {...params} size='small' fullWidth />
                              )}
                            />
                          ) : (
                            <MobileDatePicker
                              label='If yes, date of test'
                              inputFormat='MM/dd/yyyy'
                              value={
                                antenatalProfile.dateOfSyphillisTest || null
                              }
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  dateOfSyphillisTest: e,
                                });
                              }}
                              renderInput={params => (
                                <TextField {...params} size='small' fullWidth />
                              )}
                            />
                          )}
                        </>
                      </Grid>
                    )}
                  </>

                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.syphillisTest === 'No' && (
                      <TextField
                        fullWidth='90%'
                        type='text'
                        label='If no, refer for further counselling'
                        placeholder='If no, refer for further counselling'
                        size='small'
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            furtherCounsellingReferral: e.target.value,
                          });
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          motherSyphillisStatus: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Syphillis status of mother: '
                      />
                      <Grid container spacing={1} padding='.5em'>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='R'
                            control={<Radio />}
                            label='R'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='Inconclusive'
                            control={<Radio />}
                            label='Inconclusive'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='NR'
                            control={<Radio />}
                            label='NR'
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.motherHivStatus === 'R' && (
                      <>
                        {!isMobile ? (
                          <DesktopDatePicker
                            label='If yes, date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.motherHivTestDate || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                motherHivTestDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label='If yes, date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.motherHivTestDate || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                motherHivTestDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>

                <Stack direction='row' spacing={2} alignContent='right'>
                  {!isMobile && (
                    <Typography sx={{ minWidth: '80%' }}></Typography>
                  )}
                  <Button
                    variant='contained'
                    onClick={e => {
                      handleChange(null, '1');
                    }}
                    disableElevation
                    sx={{ backgroundColor: 'gray' }}
                  >
                    PREVIOUS
                  </Button>
                  <Button
                    variant='contained'
                    onClick={e => {
                      handleChange(null, '3');
                    }}
                    disableElevation
                    sx={{ backgroundColor: '#632165' }}
                  >
                    NEXT
                  </Button>
                </Stack>
              </TabPanel>
              <TabPanel value='3' index={3}>
                <p></p>
                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  Hepatitis B Testing
                </Typography>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          hepatitisBTest: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Hepatitis B test: '
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
                  <>
                    {antenatalProfile.hepatitisBTest === 'Yes' && (
                      <Grid item xs={12} md={12} lg={6}>
                        <>
                          {!isMobile ? (
                            <DesktopDatePicker
                              label='If yes, date of test'
                              inputFormat='MM/dd/yyyy'
                              value={
                                antenatalProfile.dateOfHepatitisBTest || null
                              }
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  dateOfHepatitisBTest: e,
                                });
                              }}
                              renderInput={params => (
                                <TextField {...params} size='small' fullWidth />
                              )}
                            />
                          ) : (
                            <MobileDatePicker
                              label='If yes, date of test'
                              inputFormat='MM/dd/yyyy'
                              value={
                                antenatalProfile.dateOfHepatitisBTest || null
                              }
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  dateOfHepatitisBTest: e,
                                });
                              }}
                              renderInput={params => (
                                <TextField {...params} size='small' fullWidth />
                              )}
                            />
                          )}
                        </>
                      </Grid>
                    )}
                  </>

                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.hepatitisBTest === 'No' && (
                      <TextField
                        fullWidth='90%'
                        type='text'
                        label='If no, refer for further counselling'
                        placeholder='If no, refer for further counselling'
                        size='small'
                        onChange={e => {
                          setAntenatalProfile({
                            ...antenatalProfile,
                            furtherCounsellingReferralHB: e.target.value,
                          });
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          motherHepatitisBStatus: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Hepatitis B status of mother: '
                      />
                      <Grid container spacing={1} padding='.5em'>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='R'
                            control={<Radio />}
                            label='R'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='Inconclusive'
                            control={<Radio />}
                            label='Inconclusive'
                            //   width='50%'
                          />
                        </Grid>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='NR'
                            control={<Radio />}
                            label='NR'
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.motherHivStatus === 'R' && (
                      <>
                        {!isMobile ? (
                          <DesktopDatePicker
                            label='If yes, date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.motherHivTestDate || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                motherHivTestDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label='If yes, date of test'
                            inputFormat='MM/dd/yyyy'
                            value={antenatalProfile.motherHivTestDate || null}
                            onChange={e => {
                              setAntenatalProfile({
                                ...antenatalProfile,
                                motherHivTestDate: e,
                              });
                            }}
                            renderInput={params => (
                              <TextField {...params} size='small' fullWidth />
                            )}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>

                <Divider />
                <p></p>
                <Typography
                  variant='p'
                  sx={{ fontSize: 'large', fontWeight: 'bold' }}
                >
                  Couple Counselling and Testing
                </Typography>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          coupleCounselingAndTesting: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Couple HIV Counselling and testing done: '
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

                  <Grid item xs={12} md={12} lg={6} />
                </Grid>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <RadioGroup
                      row
                      onChange={e => {
                        setAntenatalProfile({
                          ...antenatalProfile,
                          partnerHivStatus: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        sx={{ width: '50%' }}
                        control={<FormLabel />}
                        label='Partner HIV Status: '
                      />
                      <Grid container spacing={1} padding='.5em'>
                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='Reactive'
                            control={<Radio />}
                            label='Reactive'
                            //   width='50%'
                          />
                        </Grid>

                        <Grid xs={6} md={6} lg={4}>
                          <FormControlLabel
                            value='Non Reactive'
                            control={<Radio />}
                            label='Non Reactive'
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    {antenatalProfile.partnerHivStatus === 'Reactive' && (
                   <RadioGroup
                   row
                   onChange={e => {
                     setAntenatalProfile({
                       ...antenatalProfile,
                       partnerReferredForHivCare: e.target.value,
                     });
                   }}
                 >
                   <FormControlLabel
                     value={0}
                     sx={{ width: '50%' }}
                     control={<FormLabel />}
                     label='If reactive was the partner Referred for HIV care? '
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
                    )}
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}/>
                  <Grid item xs={12} md={12} lg={6}>
                        <>
                          {!isMobile ? (
                            <DesktopDatePicker
                              label='Referral date'
                              inputFormat='MM/dd/yyyy'
                              value={
                                antenatalProfile.referralDate || null
                              }
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  referralDate: e,
                                });
                              }}
                              renderInput={params => (
                                <TextField {...params} size='small' fullWidth />
                              )}
                            />
                          ) : (
                            <MobileDatePicker
                              label='If yes, date of test'
                              inputFormat='MM/dd/yyyy'
                              value={
                                antenatalProfile.referralDate || null
                              }
                              onChange={e => {
                                setAntenatalProfile({
                                  ...antenatalProfile,
                                  referralDate: e,
                                });
                              }}
                              renderInput={params => (
                                <TextField {...params} size='small' fullWidth />
                              )}
                            />
                          )}
                        </>
                      </Grid>
                </Grid>
                <Stack direction='row' spacing={2} alignContent='right'>
                  {!isMobile && (
                    <Typography sx={{ minWidth: '80%' }}></Typography>
                  )}
                  <Button
                    variant='contained'
                    onClick={e => {
                      handleChange(null, '2');
                    }}
                    disableElevation
                    sx={{ backgroundColor: 'gray' }}
                  >
                    PREVIOUS
                  </Button>
                  <Button
                    variant='contained'
                    // onClick={e => {
                    //   handleChange(null, '3');
                    // }}
                    disableElevation
                    sx={{ backgroundColor: '#632165' }}
                  >
                    Preview
                  </Button>
                </Stack>
              </TabPanel>
            </TabContext>
          </form>
          <Modal
            keepMounted
            open={openModal}
            sx={{ overflow: 'scroll' }}
            onClose={handleClose}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <br />
              {((observations && observations.length < 1) || !observations) && (
                <>
                  <CircularProgress />
                  <Typography variant='h6'>Loading</Typography>
                </>
              )}
              <Grid container columnSpacing={1}>
                {observations &&
                  observations.map(observation => {
                    return (
                      <>
                        <Grid item lg={4} xl={6} md={6} sm={12}>
                          <Box
                            sx={{
                              padding: '1em',
                              border: '1px grey solid',
                              borderRadius: '10px',
                            }}
                          >
                            {observation.resource.code.coding &&
                              observation.resource.code.coding.map(entry => {
                                return (
                                  <>
                                    <Typography variant='h6'>
                                      {entry.display}
                                    </Typography>
                                    <Typography variant='p'>
                                      {observation.resource.valueQuantity
                                        ? observation.resource.valueQuantity
                                            .value
                                        : observation.resource.valueString ??
                                          observation.resource.valueDateTime ??
                                          '-'}
                                    </Typography>
                                    {/* <br /> */}
                                  </>
                                );
                              })}
                            <br />
                          </Box>
                          <p></p>
                        </Grid>
                      </>
                    );
                  })}
              </Grid>
            </Box>
          </Modal>
        </Container>
      </LocalizationProvider>
    </>
  );
}
