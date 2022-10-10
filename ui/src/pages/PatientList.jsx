import {
  Stack,
  TextField,
  Button,
  Container,
  useMediaQuery,
  Snackbar,
  Alert,
  Typography,
  Select,
  InputLabel,
  Paper,
  IconButton,
  Divider,
  Input,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from '../lib/cookie';
import { FhirApi } from './../lib/api';
import { startVisit } from '../lib/startVisit';

const useStyles = makeStyles({
  patientSearch: {
    marginLeft: '5px',
    borderBottom: 'none',
    '& div': {
      '&::before': {
        borderBottom: 'none !important',
      },
      '&::after': {
        borderBottom: 'none !important',
      },
      '&&:hover': {
        borderBottom: 'none',
        '&&:before': {
          borderBottom: 'none',
        },
      },
    },
    '& .Mui-focused': {
      color: 'black !important',
      fontWeight: 'bold',
    },
    '& input': {
      fontWeight: '300',
    },
    '&&:before': {
      borderBottom: 'none',
    },
    '&&:after': {
      borderBottom: 'none !important',
    },
    '&&:hover': {
      borderBottom: 'none',
      '&&:before': {
        borderBottom: 'none',
      },
    },
  },
  filterList: {
    display: 'flex !important',
    alignItems: 'center !important',
    '& span': {
      marginLeft: '5px',
    },
  },
});

export default function PatientList() {
  let [patients, setPatients] = useState([]);
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [message, setMessage] = useState(false);
  let [loading, setLoading] = useState(false);
  let [selected, setSelected] = useState([]);
  let [name, setName] = useState('');
  const [filter, setFilter] = useState('name');
  const classes = useStyles();

  let startPatientVisit = async () => {
    if (selected.length === 1) {
      await startVisit(selected[0]);
      navigate('/antenatal-profile');
    }
    return;
  };

  let viewPatient = async () => {
    if (selected.length === 1) {
      navigate(`/patients/${selected[0]}`);
    }
    return;
  };

  let deletePatients = async () => {
    if (selected.length > 0) {
      for (let i of selected) {
        let data = await FhirApi({
          url: `/fhir/Patient/${i}?_cascade=delete`,
          method: 'DELETE',
        });
        console.log(data);
      }
    }
    getPatients();
    return;
  };

  const onFilterChange = async () => {
    try {
      setLoading(true);
      let data = await FhirApi({
        url: `/fhir/Patient?${filter}`,
        method: 'GET',
      });
      let p = data.data.entry.map(i => {
        let r = i.resource;
        return {
          id: r.id,
          lastName: r.name[0].family,
          age: `${Math.floor(
            (new Date() - new Date(r.birthDate).getTime()) / 3.15576e10
          )} years`,
        };
      });
      // setPatients(p);
      setLoading(false);
      return;
    } catch (error) {
      setMessage(`Error fetching patients`);
      setOpen(true);
      setLoading(false);
      setPatients([]);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      return;
    }
  };

  useEffect(() => {
    if (filter) {
      onFilterChange();
    }
  }, [filter]);

  let search = async name => {
    try {
      setLoading(true);
      let data = await FhirApi({
        url: `/fhir/Patient?name=${name}`,
        method: 'GET',
      });
      let p = data.data.entry.map((i, index) => {
        let r = i.resource;
        console.log(r.name);
        return {
          index,
          id: r.id,
          lastName: r.name[0].family,
          age: `${Math.floor(
            (new Date() - new Date(r.birthDate).getTime()) / 3.15576e10
          )} years`,
        };
      });
      setPatients(p);
      setLoading(false);
      return;
    } catch (error) {
      setMessage(`Could not find the patient ${name}`);
      setOpen(true);
      setLoading(false);
      setPatients([]);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      return;
    }
  };

  let getPatients = async () => {
    setLoading(true);
    let data = await FhirApi({
      url: '/fhir/Patient?_count=100',
      method: 'GET',
    });
    let p = data.data.entry.map((i, index) => {
      let r = i.resource;
      // console.log(r.name)
      return {
        id: r.id,
        index,
        lastName: r.name ? r.name[0].family : 'Not Provided',
        age: `${Math.floor(
          (new Date() - new Date(r.birthDate).getTime()) / 3.15576e10
        )} years`,
      };
    });
    setPatients(p);
    setLoading(false);
    return;
  };

  const chageFilter = e => {
    const { value } = e.target;
    switch (value) {
      case 'All':
        setFilter('');
        break;
      case 'Referred':
        setFilter('');
        break;
      case 'Not referred':
        setFilter('');
        break;
      default:
        setFilter('');
        break;
    }
  };

  useEffect(() => {
    getPatients();
  }, []);

  useEffect(() => {
    if (getCookie('token')) {
      window.localStorage.setItem('activeTab', 'patients');
      return;
    } else {
      navigate('/login');
      window.localStorage.setItem('next_page', '/patients');
      return;
    }
  }, []);
  const [selectionModel, setSelectionModel] = useState([]);

  const columns = [
    {
      field: 'index',
      headerName: 'Patient ID',
      width: 100,
      renderCell: params => params.row.index + 1,
    },
    { field: 'lastName', headerName: 'Full Names', flex: 1, editable: true },
    { field: 'age', headerName: 'Age', flex: 1 },
    {
      field: 'name',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => {
        // check if patient has an active visit and address field is not empty array

        return (
          <Button
            onClick={() => {
              startVisit(params.row.id);
              navigate('/antenatal-profile');
            }}
          >
            Start Visit
          </Button>
        );
      },
    },
  ];

  let isMobile = useMediaQuery('(max-width:600px)');

  let args = qs.parse(window.location.search);

  const categories = [
    'All',
    'Referred',
    'Not referred',
    'Upcoming appointments',
  ];

  return (
    <>
      <br />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={''}
        message={message}
        key={'loginAlert'}
      />
      <Stack
        direction='row'
        gap={1}
        sx={{
          paddingLeft: isMobile ? '1em' : '2em',
          paddingRight: isMobile ? '1em' : '2em',
        }}
        justifyContent='space-between'
      >
        <Paper
          component='form'
          onSubmit={e => {
            e.preventDefault();
            search(name);
          }}
          sx={{
            p: '0px',
            display: 'flex',
            alignItems: 'center',
            width: '60%',
          }}
        >
          <TextField
            sx={{ ml: 1, flex: 1 }}
            placeholder='Type here'
            className={classes.patientSearch}
            onChange={e => {
              setName(e.target.value);
            }}
            variant='standard'
            label='Search'
            autoComplete='off'
          />
          <IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
          <>
            <InputLabel id='demo-simple-select-label'>Filter By </InputLabel>
            <Select
              onChange={chageFilter}
              input={<Input className={classes.patientSearch} />}
              renderValue={selected => {
                if (!selected) {
                  return <em>Filter By</em>;
                }

                return selected;
              }}
              inputProps={{ 'aria-label': 'Standard label' }}
            >
              {categories.map(category => (
                <MenuItem
                  key={category}
                  value={category}
                  className={classes.filterList}
                >
                  <RadioButtonCheckedIcon />
                  <span>{category}</span>
                </MenuItem>
              ))}
            </Select>
          </>
        </Paper>
        <Button
          variant='contained'
          disableElevation
          sx={{ backgroundColor: '#632165' }}
          onClick={e => {
            navigate('/patient-registration');
          }}
        >
          Register Patient
        </Button>
      </Stack>
      <br />
      <Stack direction='row' spacing={2} alignContent='right'>
        {!isMobile && (
          <Typography
            sx={{ minWidth: selected.length > 0 ? '35%' : '70%' }}
          ></Typography>
        )}

        {selected.length === 1 && (
          <>
            <Button
              variant='contained'
              onClick={e => {
                startPatientVisit();
              }}
              disableElevation
              sx={{ backgroundColor: '#632165' }}
            >
              Start Visit
            </Button>
            <Button
              variant='contained'
              onClick={e => {
                viewPatient();
              }}
              disableElevation
              sx={{ backgroundColor: '#632165' }}
            >
              View Patient
            </Button>
          </>
        )}
      </Stack>
      <br />
      <Container maxWidth='lg'>
        {selectionModel.length < 1 && (
          <Alert severity='error'>
            Select a patient from the list to Start visit, View Profile
            Information etc.
          </Alert>
        )}
        <p></p>
        <DataGrid
          loading={loading}
          rows={patients ? patients : []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          autoHeight
          disableSelectionOnClick
          onSelectionModelChange={e => {
            setSelected(e);
          }}
          // onCellEditStop={e => {
          //   console.log(e);
          // }}
        />
      </Container>
    </>
  );
}
