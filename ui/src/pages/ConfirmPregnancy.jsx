import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, FormControl, InputLabel, Select, MenuItem, Card, CardContent } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataGrid } from '@mui/x-data-grid';


export default function MaternityUnit({ id }) {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [data, setData] = useState({})
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    

    let savePatientDetails = async () => {

        let response = await (await fetch('/patients', {
            body: JSON.stringify({})
        }))

        return
    }

    let getPatientDetails = async ({ id }) => {
        setOpen(false)
        let data = (await (await fetch(`/patient/${id}`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
            }
        )).json())
        console.log(data)
        setOpen(false)
        if (data.status === "error") {
            setMessage(data.error)
            setOpen(true)
            return
        }
        else {
            setPatient(data.patient)
            return
        }
    }
    let [patients, setPatients] = useState()
    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 25 },
        { field: 'names', headerName: 'Last Name', width: 150, editable: true },
        { field: 'username', headerName: 'First Name', width: 150, editable: true },
        { field: 'email', headerName: 'Age', width: 200 },
        { field: 'role', headerName: 'Date of confirmation', width: 150 }
    ];

    useEffect(() => {
        getPatientDetails(id)
    }, [])
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                

                    <Container sx={{ border: '1px white dashed' }}>

                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example">
                                    <Tab label="Confirm Pregnancy" value="1" />
                                    <Tab label="Confirmed Pregnancies" value="2" />
                                    <Tab label="Reports" value="3" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Confirm Pregnancy</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Pregnacy Confirmed?</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.role}
                                                label="Role"
                                                onChange={e => { setData({ ...data, role: e.target.value }) }}
                                                size="small"
                                            >
                                                <MenuItem value={true}>True</MenuItem>
                                                <MenuItem value={false}>False</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>

                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>
                            <TabPanel value='2'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Confirmed Pregnancies</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                </Grid>

                                <Grid container spacing={1} padding=".5em" >

                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Container maxWidth="lg">
                    <DataGrid
                        loading={patients ? false : true}
                        rows={patients ? patients : []}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        autoHeight
                        disableSelectionOnClick
                        onCellEditStop={e => { console.log(e) }}
                        onSelectionModelChange={(selection) => {
                            if (selection.length > 1) {
                                const selectionSet = new Set(selectionModel);
                                const result = selection.filter((s) => !selectionSet.has(s));

                                setSelectionModel(result);
                            } else {
                                setSelectionModel(selection);
                            }
                        }}
                    />
                </Container>
                            </TabPanel>
                            <TabPanel value='3'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Registration</Typography>
                                <Divider />

                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>




                        </TabContext>
                    </Container>
                
            </LocalizationProvider>
        </>
    )

}




