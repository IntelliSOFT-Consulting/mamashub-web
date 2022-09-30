import {
  Container,
  FormGroup,
  Modal,
  TextField,
  Stack,
  Button,
  CircularProgress,
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
import { Patient } from '../lib/fhir/resources';
import CurrentPatient from '../components/CurrentPatient';
import { timeSince } from '../lib/timeSince';

export default function PreviousPregnancy() {
  let [patient, setPatient] = useState({});

  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  const [value, setValue] = useState('1');
  let [loading, setLoading] = useState(false);
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery('(max-width:600px)');
  let [previousPregnancy, setPreviousPregnancy] = useState({});
  let [observations, setObservations] = useState([]);
  let [openModal, setOpenModal] = useState(false);
  let [previousPregnancyEncounters, setPreviousPregnancyEncounters] = useState(
    []
  );
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);

  function prompt(text) {
    setMessage(text);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 4000);
    return;
  }

  let savePreviousPregnancy = async () => {
    //get current patient
    if (!visit) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }
    let patient = visit.id;
    try {
      //create Encounter
      let encounter = await createEncounter(patient, 'PREVIOUS_PREGNANCY');
      // console.log(encounter)

      //Create and Post Observations
      let res = await (
        await fetch(`${apiHost}/crud/observations`, {
          method: 'POST',
          body: JSON.stringify({
            patientId: patient,
            encounterId: encounter,
            observations: previousPregnancy,
          }),
          headers: { 'Content-Type': 'application/json' },
        })
      ).json();
      console.log(res);

      if (res.status === 'success') {
        prompt('Previous Pregnancy saved successfully');
        // setValue('2')
        await getPreviousPregnancyEncounters(patient);
        return;
      } else {
        prompt(res.error);
        return;
      }
    } catch (error) {
      console.error(error);
      prompt(JSON.stringify(error));
      return;
    }
  };

  let getPreviousPregnancyEncounters = async patientId => {
    setLoading(true);
    let encounters = await (
      await fetch(
        `${apiHost}/crud/encounters?patient=${patientId}&encounterCode=${'PREVIOUS_PREGNANCY'}`
      )
    ).json();
    console.log(encounters);
    setPreviousPregnancyEncounters(encounters.encounters);
    setLoading(false);
    return;
  };

  useEffect(() => {
    let visit = window.localStorage.getItem('currentPatient') ?? null;
    visit = JSON.parse(visit) ?? null;
    if (visit) {
      getPreviousPregnancyEncounters(visit.id);
    }
  }, []);

  let getEncounterObservations = async encounter => {
    setObservations([]);
    handleOpen();
    let observations = await (
      await fetch(`${apiHost}/crud/observations?encounter=${encounter}`)
    ).json();
    setObservations(observations.observations);
    return;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    return;
  };

  useEffect(() => {
    let visit = window.localStorage.getItem('currentPatient');
    if (!visit) {
      prompt(
        'No patient visit not been initiated. To start a visit, Select a patient in the Patients list'
      );
      return;
    }
    setVisit(JSON.parse(visit));
    return;
  }, []);

  useEffect(() => {
    if (getCookie('token')) {
      window.localStorage.setItem('activeTab', 'previous-pregnancy');
      return;
    } else {
      window.localStorage.setItem('next_page', '/previous-pregnancy');
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
            // onClose={""}
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
              >
                <Tab label='Previous Pregnancy' value='1' />
              </TabList>
            </Box>
            <TabPanel value='1'>
              <Grid container spacing={1} padding='.5em'>
                {previousPregnancyEncounters.length > 0 &&
                  previousPregnancyEncounters.map((x, index) => {
                    return (
                      <Grid item xs={12} md={12} lg={3}>
                        <Button
                          variant='contained'
                          onClick={e => {
                            getEncounterObservations(x.resource.id);
                          }}
                          sx={{ backgroundColor: '#632165', width: '99%' }}
                        >
                          Pregnancy - {`${index + 1}`}
                        </Button>
                      </Grid>
                    );
                  })}
                {previousPregnancyEncounters.length < 1 && loading && (
                  <>
                    <CircularProgress />
                  </>
                )}
              </Grid>
              <Typography variant='h6' sx={{ mb: 1 }}>
                Pregnancy Details
              </Typography>
              <Divider />
              <p></p>
              <Grid container spacing={1} padding='.5em'>
                <Grid item xs={12} md={12} lg={4}>
                  <TextField
                    fullWidth='100%'
                    type='text'
                    label='Pregnancy Order'
                    placeholder='Pregnancy Order'
                    size='small'
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        pregnancyOrder: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <TextField
                    fullWidth='100%'
                    type='text'
                    label='Year'
                    placeholder='Year'
                    size='small'
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        ppYear: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={12} lg={4}>
                  <TextField
                    fullWidth='100%'
                    type='text'
                    label='No of times ANC attended for every pregnancy'
                    placeholder='No of times ANC attended for every pregnancy'
                    size='small'
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        ancVisits: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <TextField
                    fullWidth='100%'
                    type='text'
                    label='Place of child birth'
                    placeholder='Place of child birth'
                    size='small'
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        placeOfBirth: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <TextField
                    fullWidth='100%'
                    type='text'
                    label='Gestation (weeks)'
                    placeholder='Gestation (weeks)'
                    size='small'
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        gestation: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <TextField
                    fullWidth='100%'
                    type='text'
                    label='Duration of labor'
                    placeholder='Duration of labor'
                    size='small'
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        durationOfLabor: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        modeOfDelivery: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      sx={{ width: '25%' }}
                      control={<FormLabel />}
                      label='Mode of delivery: '
                    />
                    <FormControlLabel
                      value={'Vaginal Delivery'}
                      control={<Radio />}
                      label='Vaginal Delivery'
                    />
                    <FormControlLabel
                      value={'Assisted Vaginal Delivery'}
                      control={<Radio />}
                      label='Assisted Vaginal Delivery'
                    />
                    <FormControlLabel
                      value={'Caeserean Section'}
                      control={<Radio />}
                      label='Caeserean Section'
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
              <p></p>
              <Typography variant='h6'>Baby details</Typography>
              <Divider />
              <p></p>
              <Grid container spacing={1} padding='1em'>
                <Grid item xs={12} md={12} lg={6}>
                  <TextField
                    fullWidth='100%'
                    type='text'
                    label='Birth weight (g)'
                    placeholder='Birth weight (g)'
                    size='small'
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        babyWeight: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}/>
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        babyWeight: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Baby sex'
                    />
                    <FormControlLabel
                      value={'Male'}
                      control={<Radio />}
                      label='Male'
                    />
                    <FormControlLabel
                      value={'Female'}
                      control={<Radio />}
                      label='Female'
                    />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} md={12} lg={6}/>
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        babyWeight: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Outcome'
                    />
                    <FormControlLabel
                      value={'Dead'}
                      control={<Radio />}
                      label='Dead'
                    />
                    <FormControlLabel
                      value={'Alive'}
                      control={<Radio />}
                      label='Alive'
                    />
                  </RadioGroup>
                </Grid>
                 <Grid item xs={12} md={12} lg={6}/>
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      console.log(e);
                    }}
                  >
                    <FormControlLabel
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Purperium'
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
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <TextField
                    fullWidth='90%'
                    type='text'
                    label='If abnormal, specify'
                    placeholder='If abnormal, specify'
                    size='small'
                    onChange={e => {
                      setPreviousPregnancy({
                        ...previousPregnancy,
                        surgicalOperationReason: e.target.value,
                      });
                    }}
                  />
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
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={e => {
                    savePreviousPregnancy();
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
                            {/* <Typography sx={{ fontWeight: "bold" }} variant="p">Time: {new Date(observation.resource.meta.lastUpdated).toUTCString()}</Typography><br /> */}
                            {/* <Typography variant="p">Observation Code: {JSON.stringify(observation.resource.code.coding)}</Typography> */}
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
