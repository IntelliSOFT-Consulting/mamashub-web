import { Container, FormGroup, Checkbox, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
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
import { createEncounter, apiHost } from '../lib/api'
import CurrentPatient from '../components/CurrentPatient'


export default function BirthPlan() {

    let [visit, setVisit] = useState()
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [data, setData] = useState({})
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');
    let [birthPlan, setBirthPlan] = useState({})


    const [value, setValue] = useState('1');

    function prompt(text) {
        setMessage(text)
        setOpen(true)
        setTimeout(() => {
            setOpen(false)
        }, 4000)
        return
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
        return
    };


    let saveBirthPlan = async () => {
        //get current patient
        let patient = visit.id
        if (!patient) {
            prompt("No patient visit not been initiated. To start a visit, Select a patient in the Patient's list")
            return
        }

        //create encounter
        let encounter = await createEncounter(patient, "BIRTH-PLAN")
        console.log(encounter)

        //save observations
        let observationsList = [
        ]
        //Create and Post Observations
        let res = await (await fetch(`${apiHost}/crud/observations`, {
            method: "POST",
            body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: birthPlan }),
            headers: { "Content-Type": "application/json" }
        })).json()
        console.log(res)

        if (res.status === "success") {
            prompt("Birth Plan saved successfully")
            return
        } else {
            prompt(res.error)
            return
        }
    }

    useEffect(() => {
        let visit = window.localStorage.getItem("currentPatient")
        if (!visit) {
            prompt("No patient visit not been initiated. To start a visit, Select a patient in the Patient's list")
            return
        }
        setVisit(JSON.parse(visit))
        return
    }, [])

    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            window.localStorage.setItem("next_page", "/patient-profile")
            navigate('/login')
            return
        }
    }, [])
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                
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
                                    scrollButtons="auto">
                                    <Tab label="Birth Plan" value="2" />
                                </TabList>
                            </Box>

                            <TabPanel value='1'>
                                <Typography variant="h6">Birth Plan</Typography>
                                <Divider />
                                <p></p>

                                <Grid container spacing={1} padding=".5em" >


                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="EDD"
                                            inputFormat="MM/dd/yyyy"
                                            value={birthPlan.edd}
                                            onChange={e => { console.log(e); setBirthPlan({ ...birthPlan, edd: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="EDD"
                                                inputFormat="mm/dd/yyyy"
                                                value={birthPlan.edd}
                                                onChange={e => { console.log(e); setBirthPlan({ ...birthPlan, edd: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Health Facility Name"
                                            placeholder="Health Facility Name"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, facilityName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Health Facility Number"
                                            placeholder="Health Facility Number"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, facilityNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography variant="h6">Birth Attendant</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Name"
                                            placeholder="Name"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, birthAttendantName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Telephone Number"
                                            placeholder="Telephone Number"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, birthAttendantNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Designation"
                                            placeholder="Designation"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, birthAttendantDesignation: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography variant="h6">Alternative Birth Attendant</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Name"
                                            placeholder="Name"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, alternativeBirthAttendantName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Telephone Number"
                                            placeholder="Telephone Number"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, alternativeBirthAttendantNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Designation"
                                            placeholder="Designation"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, alternativeBirthAttendantDesignation: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography variant="h6">Birth Companion</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Name"
                                            placeholder="Name"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, birthCompanionName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Telephone Number"
                                            placeholder="Telephone Number"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, birthCompanionNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Typography></Typography>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Relationship"
                                            placeholder="Relationship"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, birthCompanionRelationship: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Transport means"
                                            placeholder="Transport means"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, birthCompanionTransportMeans: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography variant="h6">Alternative Birth Companion</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Name"
                                            placeholder="Name"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, alternativeBirthCompanionName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Telephone Number"
                                            placeholder="Telephone Number"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, alternativeBirthCompanionNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Relationship"
                                            placeholder="Relationship"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, alternativeBirthCompanionRelationship: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Transport Means"
                                            placeholder="Transport Means"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, alternativeBirthCompanionTransportMeans: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography variant="h6">Blood Donor</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Name"
                                            placeholder="Name"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, bloodDonorName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Telephone Number"
                                            placeholder="Telephone Number"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, bloodDonorNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Blood group"
                                            placeholder="Blood group"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, bloodDonorBloodGroup: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography variant="h6">Financial Plan</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Financial plan for child birth"
                                            placeholder="Financial plan for child birth"
                                            size="small"
                                            onChange={e => { setBirthPlan({ ...birthPlan, financialPlan: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>

                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }} onClick={e => { setBirthPlan({}) }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveBirthPlan() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                        </TabContext>
                    </Container>
                
            </LocalizationProvider>
        </>
    )

}




