import {
  Container,
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

export default function ANCProfile() {
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [data, setData] = useState({});
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery('(max-width:600px)');
  let [medicalHistory, setMedicalHistory] = useState({});

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

  let saveMedicalHistory = async () => {
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
      let encounter = await createEncounter(patient, 'MEDICAL_HISTORY');
      console.log(encounter);

      //Create and Post Observations
      let res = await (
        await fetch(`${apiHost}/crud/observations`, {
          method: 'POST',
          body: JSON.stringify({
            patientId: patient,
            encounterId: encounter,
            observations: medicalHistory,
          }),
          headers: { 'Content-Type': 'application/json' },
        })
      ).json();
      console.log(res);

      if (res.status === 'success') {
        prompt('Medical and Surgical History saved successfully');
        navigate(`/patients/${patient}`);
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
      window.localStorage.setItem('next_page', '/patient-profile');
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
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                value={value}
                onChange={handleChange}
                variant='scrollable'
                scrollButtons='auto'
                aria-label='scrollable auto tabs example'
              >
                <Tab label='Medical and Surgical History' value='1' />
              </TabList>
            </Box>
            <TabPanel value='1'>
              {/* <p></p> */}
              <Typography variant='h6'>Surgical History</Typography>
              <Divider />
              <Grid container spacing={1} padding='.5em'>
                <FormControl
                  sx={{ m: 3 }}
                  component='fieldset'
                  variant='standard'
                >
                  <FormLabel component='legend'>
                    Surgical Operation (Select all that apply):
                  </FormLabel>
                  <FormGroup>
                    <Grid container spacing={1} padding='1em'>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={e => {
                                setMedicalHistory({
                                  ...medicalHistory,
                                  noSurgeries: e.target.checked,
                                });
                                console.log(e.target.value);
                              }}
                              name='noSurgeries'
                            />
                          }
                          label='No known past surgeries'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={e => {
                                setMedicalHistory({
                                  ...medicalHistory,
                                  Oophorectomy: e.target.checked,
                                });
                                console.log(e.target.value);
                              }}
                              name='Oophorectomy'
                            />
                          }
                          label='Oophorectomy'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={e => {
                                setMedicalHistory({
                                  ...medicalHistory,
                                  dilation: e.target.checked,
                                });
                              }}
                              name='dilation'
                            />
                          }
                          label='Dilation and curettage'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={e => {
                                setMedicalHistory({
                                  ...medicalHistory,
                                  Salphingectomy: e.target.checked,
                                });
                                console.log(e.target.value);
                              }}
                              name='Salphingectomy'
                            />
                          }
                          label='Salphingectomy'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={e => {
                                setMedicalHistory({
                                  ...medicalHistory,
                                  Myomectomy: e.target.checked,
                                });
                                console.log(e.target.value);
                              }}
                              name='Myomectomy'
                            />
                          }
                          label='Myomectomy'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={e => {
                                setMedicalHistory({
                                  ...medicalHistory,
                                  cervicalCone: e.target.checked,
                                });
                                console.log(e.target.value);
                              }}
                              name='cervicalCone'
                            />
                          }
                          label='Cervical cone'
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={e => {
                                setMedicalHistory({
                                  ...medicalHistory,
                                  ovarianCystRemoval: e.target.checked,
                                });
                                console.log(e.target.value);
                              }}
                              name='ovarianCystRemoval'
                            />
                          }
                          label='Removal of ovarian cysts'
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                </FormControl>
                <Grid container spacing={1} padding='1em'>
                  <Grid item xs={12} md={12} lg={6}>
                    <TextField
                      fullWidth='100%'
                      type='text'
                      label='Other gynaecological procedures (specify)'
                      placeholder='Other gynaecological procedures (specify)'
                      size='small'
                      onChange={e => {
                        setMedicalHistory({
                          ...medicalHistory,
                          otherGynaecologicalProcedures: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <TextField
                      fullWidth='100%'
                      type='text'
                      label='Other surgeries (specify)'
                      placeholder='Other surgeries (specify)'
                      size='small'
                      onChange={e => {
                        setMedicalHistory({
                          ...medicalHistory,
                          otherSurgeries: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Divider />
              <p></p>
              <Typography
                variant='p'
                sx={{ fontSize: 'large', fontWeight: 'bold' }}
              >
                Medical History
              </Typography>
              <Grid container spacing={1} padding='1em'>
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        diabetes: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Diabetes: '
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
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        hypertension: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Hypertension: '
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
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        otherConditions: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Other conditions: '
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
              </Grid>
              <Grid container spacing={1} padding='1em'>
                {medicalHistory.otherConditions &&
                  medicalHistory.otherConditions === 'Yes' && (
                    <Grid item xs={12} md={12} lg={6}>
                      <FormControl component='fieldset' variant='standard'>
                        <FormLabel component='legend'>
                          If yes, select all that apply
                        </FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            label='Epilepsy'
                            control={
                              <Checkbox
                                checked={false}
                                onChange={handleChanges}
                                name='antoine'
                              />
                            }
                          />
                          <FormControlLabel
                            label='Malaria in pregnancy'
                            control={
                              <Checkbox
                                checked={false}
                                onChange={handleChanges}
                                name='antoine'
                              />
                            }
                          />
                          <FormControlLabel
                            label='Others'
                            control={
                              <Checkbox
                                checked={false}
                                onChange={handleChanges}
                                name='antoine'
                              />
                            }
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  )}
                <Grid item xs={12} md={12} lg={6} />
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        bloodTransfusion: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Blood Transfusion: '
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
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        bloodTransfusionReaction: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='If yes, was there a reaction? '
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
                <Grid item xs={12} md={12} lg={7}>
                  <TextField
                    fullWidth='90%'
                    type='text'
                    label='If yes, what was the reaction'
                    placeholder='If yes, what was the reaction'
                    size='small'
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        bloodTransfusionReactionResult: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        bloodTransfusionReactionResult: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Tuberculosis: '
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
                    setMedicalHistory({});
                  }}
                >
                  Cancel
                </Button>
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
                {/* <Button variant="contained" onClick={e => { saveMedicalHistory() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button> */}
              </Stack>
              <p></p>
            </TabPanel>
            <TabPanel value='2'>
              <p></p>

              <Typography
                variant='p'
                sx={{ fontSize: 'large', fontWeight: 'bold' }}
              >
                Drug Allergies
              </Typography>
              <Divider />
              <p></p>
              <Grid container spacing={1} padding='1em'>
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        drugAllergies: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Drug allergies: '
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
                  <TextField
                    fullWidth='90%'
                    type='text'
                    label='If yes, specify'
                    placeholder='If yes, specify'
                    size='small'
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        specificDrugAllergies: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        nonDrugAllergies: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Other non-drug allergies: '
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
                  <TextField
                    fullWidth='90%'
                    type='text'
                    label='If yes, specify'
                    placeholder='If yes, specify'
                    size='small'
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        specificNonDrugAllergies: e.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>
              <Typography
                variant='p'
                sx={{ fontSize: 'large', fontWeight: 'bold' }}
              >
                Family History
              </Typography>
              <Divider />
              <p></p>
              <Grid container spacing={1} padding='1em'>
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        twinsBothLiveBorn: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Twins: '
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
                <Grid item xs={12} md={12} lg={6}>
                  <FormControl component='fieldset' variant='standard'>
                    <FormLabel component='legend'>If yes, specify</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        label='Previous pregnancy'
                        control={
                          <Checkbox
                            checked={false}
                            onChange={handleChanges}
                            name='antoine'
                          />
                        }
                      />
                      <FormControlLabel
                        label="Mother's side"
                        control={
                          <Checkbox
                            checked={false}
                            onChange={handleChanges}
                            name='antoine'
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={6} />
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        familyHistoryTB: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Tuberculosis: '
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
                  <TextField
                    fullWidth='90%'
                    type='text'
                    label='If yes, who is the relative who contacted TB'
                    placeholder='If yes, who is the relative who contacted TB'
                    size='small'
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        familyHistoryTBName: e.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} padding='1em'>
                <Grid item xs={12} md={12} lg={6}>
                  <TextField
                    fullWidth='90%'
                    type='text'
                    label='Relationship'
                    placeholder='Relationship'
                    size='small'
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        familyHistoryTBRelationship: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6} />
                <Grid item xs={12} md={12} lg={6}>
                  <RadioGroup
                    row
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        familyLivingInSameHousehold: e.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value={0}
                      sx={{ width: '50%' }}
                      control={<FormLabel />}
                      label='Were they living in the same household: '
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
                <Grid item xs={12} md={12} lg={6}>
                  <TextField
                    fullWidth='90%'
                    type='text'
                    label='If yes, refer for TB screening'
                    placeholder='If yes, refer for TB screening'
                    size='small'
                    onChange={e => {
                      setMedicalHistory({
                        ...medicalHistory,
                        referForTBScreening: e.target.value,
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
                  onClick={e => {
                    handleChange(null, '1');
                  }}
                >
                  PREVIOUS
                </Button>
                <Button
                  variant='contained'
                  onClick={e => {
                    // handleChange(null, '2');
                  }}
                  disableElevation
                  sx={{ backgroundColor: '#632165' }}
                >
                  PREVIEW
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
