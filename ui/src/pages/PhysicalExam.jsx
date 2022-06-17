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

var Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);


export default function PhysicalExam() {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [notes, setNotes] = useState('')
    let [notesDisplay, setNotesDisplay] = useState('')
    let [data, setData] = useState({})
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');

    let saveClinicalNotes = async () => {
        setNotesDisplay(notesDisplay + "\n" + notes)
        setNotes('')
        return
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // useEffect(() => )

    useEffect(() => {

        if (window) {
            Highcharts.chart('container',
                {
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: 'Weight Monitoring'
                    },
                    subtitle: {
                        text: 'Reload to refresh data'
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },
                    yAxis: {
                        title: {
                            text: 'Weight'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: [{
                        name: 'Patient',
                        data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }]
                }
            );
            return
        }
    }, [window])


    let saveObservation = async (patientId, code, observationValue) => {
        let response = await (await fetch('/patients', {
            body: JSON.stringify({})
        }))

        return
    }


    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Layout>
                    <Container sx={{ border: '1px white dashed' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example">
                                    <Tab label="Physical Examination" value="1" />
                                    <Tab label="Weight Monitoring Chart" value="2" />
                                    <Tab label="Clinical Notes" value="3" />
                                    <Tab label="Reports" value="4" />

                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>General Examination</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Height"
                                            placeholder="Height"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Pre-gestational Weight"
                                            placeholder="Pre-gestational Weight"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Body Weight"
                                            placeholder="Body Weight"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="BMI (auto-generated)"
                                            placeholder="BMI (auto-generated)"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>

                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Systolic Blood Pressure"
                                            placeholder="Systolic Blood Pressure"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Diastolic Blood Pressure"
                                            placeholder="Diastolic Blood Pressure"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, inpatientNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Pulse Rate"
                                            placeholder="Pulse Rate"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, inpatientNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="CVS"
                                            placeholder="CVS"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, inpatientNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Respiration</Typography>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Respiration Exam Results</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.admittedFrom ? data.admittedFrom : "No"}
                                                label="Respiration Exam Results"
                                                onChange={handleChange}
                                                size="small"
                                                defaultValue={"Other"}
                                            >
                                                <MenuItem value={"Respiratory exam not done"}>Respiratory exam not done</MenuItem>
                                                <MenuItem value={"Yes"}>Normal Respiratory Exam Result</MenuItem>
                                                <MenuItem value={"No"}>Dyspnoea</MenuItem>
                                                <MenuItem value={"Yes"}>Cough</MenuItem>
                                                <MenuItem value={"Yes"}>Rapid breathing</MenuItem>
                                                <MenuItem value={"Yes"}>Slow breathing</MenuItem>
                                                <MenuItem value={"Yes"}>Wheezing</MenuItem>
                                                <MenuItem value={"Yes"}>Rales</MenuItem>
                                                <MenuItem value={"Other"}>Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <p></p>

                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>

                            <TabPanel value='2'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Weight Monitoring</Typography>
                                <Divider />

                                <p></p>
                                <div id="container" style={{ width: "100%", height: "400px" }}></div>
                                <p></p>

                            </TabPanel>
                            <TabPanel value='3'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Clinical Notes</Typography>
                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'small', fontWeight: 'bold' }}>{notesDisplay}</Typography>

                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Clinical Notes"
                                            placeholder="Clinical Notes"
                                            size="small"
                                            onChange={e => { setNotes(e.target.value) }}

                                        />
                                    </Grid>

                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveClinicalNotes() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>



                        </TabContext>
                    </Container>
                </Layout>
            </LocalizationProvider>
        </>
    )

}




