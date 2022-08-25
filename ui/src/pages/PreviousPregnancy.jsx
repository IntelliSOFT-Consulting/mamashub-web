import { Container, FormGroup, Modal, TextField, Stack, Button, CircularProgress, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { v4 as uuidv4 } from 'uuid'
import { createEncounter, FhirApi, apiHost } from '../lib/api'
import { Patient } from '../lib/fhir/resources'
import CurrentPatient from '../components/CurrentPatient'
import { timeSince } from '../lib/timeSince'



export default function PreviousPregnancy() {

    let [patient, setPatient] = useState({})

    let [visit, setVisit] = useState()
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [data, setData] = useState({})
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');
    let [birthPlan, setBirthPlan] = useState({})
    let [medicalHistory, setMedicalHistory] = useState({})
    let [patientInformation, setPatientInformation] = useState({})
    let [physicalExam, setPhysicalExam] = useState({})
    let [observations, setObservations] = useState([])
    let [openModal, setOpenModal] = useState(false)


    let [physicalExamEncounters, setPhysicalExamEncounters] = useState([])
    const handleClose = () => setOpenModal(false);
    const handleOpen = () => setOpenModal(true);


    const [value, setValue] = useState('1');
    let getPhysicalExamEncounters = async (patientId) => {
        let encounters = await (await fetch(`${apiHost}/crud/encounters?patient=${patientId}&encounterCode=${"PREVIOUS_PREGNANCY"}`)).json()
        console.log(encounters)
        setPhysicalExamEncounters(encounters.encounters)
        return
    }

    useEffect(() => {
        let visit = window.localStorage.getItem("currentPatient") ?? null
        visit = JSON.parse(visit) ?? null
        if (visit) {
            getPhysicalExamEncounters(visit.id)
        }
        console.log(visit)
    }, [])

    let getEncounterObservations = async (encounter) => {
        setObservations([])
        handleOpen()
        let observations = await (await fetch(`${apiHost}/crud/observations?encounter=${encounter}`)).json()
        console.log(observations)
        setObservations(observations.observations)
        return


    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
        return
    };
    const handleChanges = (event, newValue) => {
        // setValue(newValue);
        return
    };

    let saveSuccessfully = async () => {
        setMessage("Data saved successfully")
        setOpen(true)
        setTimeout(() => {
            setOpen(false)
        }, 2000)
        return
    }

    let savePatientInformation = async () => {

        //get patient
        let patient = visit.id

        //create encounter
        let encounter = await createEncounter(patient, "Patient-Information")
        console.log(encounter)

        //save observations
        let observationsList = [
        ]
        //Create and Post Observations
        let res = await (await fetch(`${apiHost}/crud/observations`, {
            method: "POST",
            body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: patientInformation })
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
    }


    let saveMedicalHistory = async () => {
        //get patient
        let patient = visit.id
        //create encounter
        let encounter = await createEncounter(patient, "Medical-History")
        console.log(encounter)

        //save observations
        let observationsList = [
        ]
        //Create and Post Observations
        let res = await (await fetch(`${apiHost}/crud/observations`, {
            method: "POST",
            body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: medicalHistory })
        })).json()
        console.log(res)

        if (res.status === "success") {
            setMessage("Medical History saved successfully")
            setOpen(true)
            setTimeout(() => {
                setOpen(false)
            }, 2000)
            return
        }
    }



    let saveBirthPlan = async () => {

        //get patient
        let patient = visit.id
        //create encounter
        let encounter = await createEncounter(patient, "Medical-History")
        console.log(encounter)

        //save observations
        let observationsList = [
        ]
        //Create and Post Observations
        let res = await (await fetch(`${apiHost}/crud/observations`, {
            method: "POST",
            body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: medicalHistory })
        })).json()
        console.log(res)

        if (res.status === "success") {
            setMessage("Birth Plan saved successfully")
            setOpen(true)
            setTimeout(() => {
                setOpen(false)
            }, 2000)
            return
        }
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
                                    <Tab label="Previous Pregnancy" value="1" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>General Examination</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    {(physicalExamEncounters.length > 0) && physicalExamEncounters.map((x, index) => {
                                        return <Grid item xs={12} md={12} lg={3}>
                                            <Button variant='contained' onClick={e => { getEncounterObservations(x.resource.id) }} sx={{ backgroundColor: "#632165", width: "99%" }}>Pregnancy - {`${index + 1}`}</Button>
                                        </Grid>
                                    })}
                                    {physicalExamEncounters.length < 1 && <><CircularProgress />
                                    </>}
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Year"
                                            placeholder="Year"
                                            size="small"
                                            onChange={e => { setPatientInformation({ ...patientInformation, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="No of times ANC attended for every pregnancy"
                                            placeholder="No of times ANC attended for every pregnancy"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, specifyDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Place of child birth"
                                            placeholder="Place of child birth"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, specifyDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Gestation (weeks)"
                                            placeholder="Gestation (weeks)"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, specifyDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Duration of labor"
                                            placeholder="Duration of labor"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, specifyDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={12}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { setPatientInformation({ ...patientInformation, diabetes: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "25%" }} control={<FormLabel />} label="Mode of delivery: " />
                                            <FormControlLabel value={"true"} control={<Radio />} label="Varginal Delivery" />
                                            <FormControlLabel value={"true"} control={<Radio />} label="Assisted Vaginal Delivery" />
                                            <FormControlLabel value={"false"} control={<Radio />} label="Caeserean Section" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { setPatientInformation({ ...patientInformation, hypertension: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Hypertension: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            onChange={e => { setPatientInformation({ ...patientInformation, drugAllergies: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Other conditions: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Blood Transfusion: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Typography variant="h6">Baby details</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Baby weight(g)"
                                            placeholder="Baby weight(g)"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, specifyDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={8}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Baby sex" />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Outcome" />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Purperium" />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={7}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If abnormal, specify"
                                            placeholder="If abnormal, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>

                                </Grid>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveMedicalHistory() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>
                        </TabContext>
                        <Modal
                            keepMounted
                            open={openModal}
                            sx={{ overflow: "scroll" }}
                            onClose={handleClose}
                            aria-labelledby="keep-mounted-modal-title"
                            aria-describedby="keep-mounted-modal-description"
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: "80%",
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                            }}>
                                <br />

                                {((observations && observations.length < 1) || (!observations)) && <>
                                    <CircularProgress />
                                    <Typography variant="h6">Loading</Typography>

                                </>}
                                <Grid container columnSpacing={1}>
                                    {observations && observations.map((observation) => {
                                        return <>
                                            <Grid item lg={4} xl={6} md={6} sm={12}>
                                                <Box sx={{ padding: "1em", border: "1px grey solid", borderRadius: "10px" }}>
                                                    {/* <Typography sx={{ fontWeight: "bold" }} variant="p">Time: {new Date(observation.resource.meta.lastUpdated).toUTCString()}</Typography><br /> */}
                                                    {/* <Typography variant="p">Observation Code: {JSON.stringify(observation.resource.code.coding)}</Typography> */}
                                                    {observation.resource.code.coding && observation.resource.code.coding.map((entry) => {
                                                        return <>
                                                            <Typography variant="h6">{entry.display}</Typography>
                                                            <Typography variant="p">{observation.resource.valueQuantity ? observation.resource.valueQuantity.value : (observation.resource.valueString ?? observation.resource.valueDateTime ?? "-")}</Typography>
                                                            {/* <br /> */}
                                                        </>

                                                    })}
                                                    <br />

                                                </Box>
                                                <p></p>
                                            </Grid>
                                        </>
                                    })}

                                </Grid>

                            </Box>
                        </Modal>
                    </Container>
                </Layout>
            </LocalizationProvider>
        </>
    )

}




