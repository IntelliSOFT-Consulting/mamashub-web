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
import counsellingForm from '../lib/forms/counselling';

export default function Counselling() {
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

  const sections = Object.keys(counsellingForm);

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
                <Tab label='Counselling' value='1' />
              </TabList>
            </Box>

            {/* Preventive Services  */}

            <TabPanel value='1'>
              {sections.map((section, index) => {
                return (
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
                      {counsellingForm[section].map((item, index) => (
                        <Grid item xs={12} md={12} key={index}>
                          <RadioGroup
                            row
                            onChange={e => {
                              setPreventiveServices({
                                ...preventiveServices,
                                [item.name]: e.target.value,
                              });
                            }}
                          >
                            <FormControlLabel
                              value={0}
                              sx={{ width: '50%' }}
                              control={<FormLabel />}
                              label={item.label}
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
                      ))}
                    </Grid>
                  </>
                );
              })}

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
