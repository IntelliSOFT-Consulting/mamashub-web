import { Container, TextField, Stack, Button, Grid, Snackbar, FormGroup, Checkbox, Typography, Divider, useMediaQuery, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material'
import { useEffect, useState } from 'react'
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
import CurrentPatient from '../components/CurrentPatient'
import { apiHost, createEncounter } from './../lib/api'

var Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);


export default function PhysicalExam() {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [notes, setNotes] = useState('')
    let [weightMonitoringChart, setWeightMonitoring] = useState([])

    let [visit, setVisit] = useState()
    let [physicalExam, setPhysicalExam] = useState({})
    let [notesDisplay, setNotesDisplay] = useState('')
    let [data, setData] = useState({})
    let [contact, setContact] = useState(null)
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');

    let saveClinicalNotes = async () => {
        setNotesDisplay(notesDisplay + "\n" + notes)
        setNotes('')
        return
    }
    let saveSerologyResults = async () => {
        //get patient
        let patient = visit.id
        //create encounter
        let encounter = await createEncounter(patient, "Maternal-Serology")
        console.log(encounter)
        //save observations
        let observationsList = [
        ]
        //Create and Post Observations
        let res = await (await fetch(`${apiHost}/crud/observations`, {
            method: "POST",
            body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: physicalExam })
        })).json()
        console.log(res)
        if (res.status === "success") {
            setMessage("Patient Information saved successfully")
            setOpen(true)
            setTimeout(() => {
                setOpen(false)
            }, 2000)
            return
        }
        return
    }

    let savePhysicalExam = async () => {
        //get patient
        let patient = visit.id
        //create encounter
        let encounter = await createEncounter(patient, "PHYSICAL_EXAMINATION")
        console.log(encounter)
        //save observations
        let observationsList = [
        ]
        //Create and Post Observations
        let res = await (await fetch(`${apiHost}/crud/observations`, {
            method: "POST",
            body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: physicalExam })
        })).json()
        console.log(res)
        if (res.status === "success") {
            setMessage("Patient Information saved successfully")
            setOpen(true)
            setTimeout(() => {
                setOpen(false)
            }, 2000)
            return
        }
        return
    }

    useEffect(() => {
        let visit = window.localStorage.getItem("currentPatient")
        if (!visit) {
            setMessage("No patient visit not been initiated. To start a visit, Select a patient in the Patients list")
            setOpen(true)
            setTimeout(() => {
                setOpen(false)
            }, 4000)
            return
        }
        setVisit(JSON.parse(visit))
        return
    }, [])

    let saveSuccessfully = async () => {
        setMessage("Data saved successfully")
        setOpen(true)
        setTimeout(() => {
            setOpen(false)
        }, 2000)
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // useEffect(() => )
    useEffect(() => {
        let visit = window.localStorage.getItem("currentPatient")
        if (!visit) { return }
        setVisit(JSON.parse(visit))
        return
    }, [])

    useEffect(() => {

        if (document.getElementById('container')) {
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
                        categories: ['4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26'],
                        title: {
                            text: 'Gestation in weeks'
                        }
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
                        data: [70, 69, 69, 72, 73, 73, 72, 74, 76, 78, 77, 77]
                    }]
                }
            );
            return
        }
    }, [document.getElementById('container')])


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
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            open={open}
                            onClose={""}
                            message={message}
                            key={"loginAlert"}
                        />
                        {visit && <CurrentPatient data={visit} />}

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

                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>General Examination</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    {[1, 2, 3].map((x) => {
                                        return <Grid item xs={12} md={12} lg={3}>
                                            <Button variant='contained' sx={{ backgroundColor: "#632165", width: "80%" }}>ANC Visit {`${x}`}</Button>
                                        </Grid>
                                    })}
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Surgical Operation: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Normal" />
                                            <FormControlLabel value={false} control={<Radio />} label="Abnormal" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If abnormal, specify"
                                            placeholder="If abnormal, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
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
                                            onChange={e => { setPhysicalExam({ ...physicalExam, bmi: e.target.value }) }}
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
                                            onChange={e => { setPhysicalExam({ ...physicalExam, bp: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Diastolic Blood Pressure"
                                            placeholder="Diastolic Blood Pressure"
                                            size="small"
                                            onChange={e => { setPhysicalExam({ ...physicalExam, bp: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Pulse Rate"
                                            placeholder="Pulse Rate"
                                            size="small"
                                            onChange={e => { setPhysicalExam({ ...physicalExam, pulseRate: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Temperature"
                                            placeholder="Temperature"
                                            size="small"
                                            onChange={e => { setPhysicalExam({ ...physicalExam, temperature: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, cvs: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="CVs: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Normal" />
                                            <FormControlLabel value={false} control={<Radio />} label="Abnormal" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If abnormal, specify"
                                            placeholder="If abnormal, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Respiration: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Normal" />
                                            <FormControlLabel value={false} control={<Radio />} label="Abnormal" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If abnormal, specify"
                                            placeholder="If abnormal, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            // aria-labelledby="demo-row-radio-buttons-group-label"
                                            // name="row-radio-buttons-group"
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Breast Exam: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Normal" />
                                            <FormControlLabel value={false} control={<Radio />} label="Abnormal" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If normal, record findings"
                                            placeholder="If normal, record findings"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If abnormal, specify"
                                            placeholder="If abnormal, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>

                                </Grid>

                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Weight Monitoring</Typography>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="number"
                                            label="Mother's weight (kg)"
                                            placeholder="Mother's weight (kg)"
                                            size="small"
                                            onChange={e => { setPhysicalExam({ ...physicalExam, temperature: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="number"
                                            label="Gestation in weeks"
                                            placeholder="Gestation in weeks"
                                            size="small"
                                            onChange={e => { setPhysicalExam({ ...physicalExam, temperature: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Abdmonial Examinations</Typography>
                                <Divider />

                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Inspection Done: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Palpation Done: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Auscalation Done: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>External Genitalia Examination</Typography>
                                <Divider />

                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Inspection Done: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Palpation Done: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Discharge Present: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="Genital ulcer present: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPhysicalExam({ ...physicalExam, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "40%" }} control={<FormLabel />} label="FGM done: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                            <FormLabel component="legend">Assign responsibility</FormLabel>
                                            <FormGroup>
                                                <FormControlLabel label="Scarring"
                                                    control={
                                                        <Checkbox checked={"jason"} onChange={handleChange} name="jason" />
                                                    }
                                                />
                                                <FormControlLabel label="Dyspaneuria"
                                                    control={
                                                        <Checkbox checked={"antoine"} onChange={handleChange} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="Keloids"
                                                    control={
                                                        <Checkbox checked={"antoine"} onChange={handleChange} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="UTI"
                                                    control={
                                                        <Checkbox checked={"antoine"} onChange={handleChange} name="antoine" />
                                                    }
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>



                                </Grid>

                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveSuccessfully() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
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




