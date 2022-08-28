import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery, CircularProgress, Modal } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import CurrentPatient from '../components/CurrentPatient'
import { apiHost, createEncounter } from '../lib/api'


export default function PresentPregnancy() {

    let [patient, setPatient] = useState({})
    let [visit, setVisit] = useState()
    let [open, setOpen] = useState(false)
    let [loading, setLoading] = useState(false)
    let [message, setMessage] = useState(false)
    let [observations, setObservations] = useState([])
    let isMobile = useMediaQuery('(max-width:600px)');
    let [presentPregnancy, setPresentPregnancy] = useState({})
    let [presentPregnancyEncounters, setPresentPregnancyEncounters] = useState([])
    const handleClose = () => setOpenModal(false);
    const handleOpen = () => setOpenModal(true);
    const [value, setValue] = useState('1');
    let [openModal, setOpenModal] = useState(false)


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
    };
    let saveSuccessfully = async () => {
        setMessage("Data saved successfully")
        setOpen(true)
        setTimeout(() => {
            setOpen(false)
        }, 2000)
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

    useEffect(() => {
        let visit = window.localStorage.getItem("currentPatient")
        if (!visit) {
            prompt("No patient visit not been initiated. To start a visit, Select a patient in the Patients list")
            return
        }
        setVisit(JSON.parse(visit))
        return
    }, [])

    useEffect(() => {
        let visit = window.localStorage.getItem("currentPatient") ?? null
        visit = JSON.parse(visit) ?? null
        if (visit) {
            getPresentPregnancyEncounters(visit.id)
        }
    }, [])


    let getEncounterObservations = async (encounter) => {
        setObservations([])
        handleOpen()
        let observations = await (await fetch(`${apiHost}/crud/observations?encounter=${encounter}`)).json()
        setObservations(observations.observations)
        return
    }

    let getPresentPregnancyEncounters = async (patientId) => {
        setLoading(true)
        let encounters = await (await fetch(`${apiHost}/crud/encounters?patient=${patientId}&encounterCode=${"PRESENT_PREGNANCY"}`)).json()
        console.log(encounters)
        setPresentPregnancyEncounters(encounters.encounters)
        setLoading(false)
        return
    }
    let savePresentPregnancy = async () => {
        //get current patient
        if (!visit) {
            prompt("No patient visit not been initiated. To start a visit, Select a patient in the Patient's list")
            return
        }
        let patient = visit.id
        try {
            //create Encounter
            let encounter = await createEncounter(patient, "PRESENT_PREGNANCY")
            // console.log(encounter)

            //Create and Post Observations
            let res = await (await fetch(`${apiHost}/crud/observations`, {
                method: "POST",
                body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: presentPregnancy }),
                headers: { "Content-Type": "application/json" }
            })).json()
            console.log(res)

            if (res.status === "success") {
                prompt("Present Pregnancy saved successfully")
                // setValue('2')
                await getPresentPregnancyEncounters(patient)
                return
            } else {
                prompt(res.error)
                return
            }
        } catch (error) {
            console.error(error)
            prompt(JSON.stringify(error))
            return
        }
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
                                    <Tab label="Present Pregnancy" value="1" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}

                                <Grid container spacing={1} padding=".5em" >
                                    {(presentPregnancyEncounters.length > 0) && presentPregnancyEncounters.map((x, index) => {
                                        return <Grid item xs={12} md={12} lg={3}>
                                            <Button variant='contained' onClick={e => { getEncounterObservations(x.resource.id) }} sx={{ backgroundColor: "#632165", width: "99%" }}>Contact - {`${index + 1}`}</Button>
                                        </Grid>
                                    })}
                                </Grid>
                                {presentPregnancyEncounters.length < 1 && loading && <><CircularProgress /></>}
                                <Divider />

                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Current Pregnancy Details</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            // width="90%"
                                            type="text"
                                            label="MUAC (cm)"
                                            placeholder="MUAC (cm)"
                                            size="small"
                                            onChange={e => { setPresentPregnancy({ ...presentPregnancy, presentPregnancyDetailsMUAC: e.target.value }) }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row onChange={e => { setPresentPregnancy({ ...presentPregnancy, presentPregnancyUrineTestDone: e.target.value }) }}
                                        >
                                            <FormControlLabel sx={{ width: "50%" }} control={<FormLabel />} label="Urine test done: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    {(presentPregnancy.urineTestDone === "Yes") && <Grid item xs={12} md={12} lg={7}>
                                        <TextField
                                            fullWidth="90%" type="text" label="If yes, give results" placeholder="If yes, give results" size="small"
                                            onChange={e => { setPresentPregnancy({ ...presentPregnancy, presentPregnancyUrineTestResults: e.target.value }) }}
                                        />
                                    </Grid>}
                                </Grid>

                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Blood Pressure</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Systolic Blood Pressure"
                                            placeholder="Systolic Blood Pressure"
                                            size="small"
                                            onChange={e => { setPresentPregnancy({ ...presentPregnancy, bpSystolic: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Diastolic Blood Pressure"
                                            placeholder="Diastolic Blood Pressure"
                                            size="small"
                                            onChange={e => { setPresentPregnancy({ ...presentPregnancy, bpDiastolic: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>

                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>HB Test</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row onChange={e => { setPresentPregnancy({ ...presentPregnancy, hbTestHbTestDone: e.target.value }) }}
                                        >
                                            <FormControlLabel sx={{ width: "50%" }} control={<FormLabel />} label="Hb test done: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    {(presentPregnancy.hbTestDone === "Yes") && <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If yes, give results"
                                            placeholder="If yes, give results"
                                            size="small"
                                            onChange={e => { setPresentPregnancy({ ...presentPregnancy, hbTestHbTestReading: e.target.value }) }}
                                        />
                                    </Grid>}
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Pallor"
                                            placeholder="Pallor"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, hbTestPallor: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Gestation in weeks"
                                            placeholder="Gestation in weeks"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, hbTestGestation: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Fundal Height"
                                            placeholder="Fundal Height"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, hbTestFundalHeight: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Presentation</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Presentation"
                                            placeholder="Presentation"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, presentation: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={8}>
                                        <RadioGroup
                                            row onChange={e => { setPresentPregnancy({ ...presentPregnancy, presentationLie: e.target.value }) }}
                                        >
                                            <FormControlLabel sx={{ width: "35%" }} control={<FormLabel />} label="Lie: " />
                                            <FormControlLabel value={"Longitudinal"} control={<Radio />} label="Longitudinal" />
                                            <FormControlLabel value={"Oblique"} control={<Radio />} label="Oblique" />
                                            <FormControlLabel value={"Transverse"} control={<Radio />} label="Transverse" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RadioGroup
                                            row onChange={e => { setPresentPregnancy({ ...presentPregnancy, presentationFoetalHeartRate: e.target.value }) }}
                                        >
                                            <FormControlLabel sx={{ width: "39%" }} control={<FormLabel />} label="Foetal heart rate: " />
                                            <FormControlLabel value={"Normal"} control={<Radio />} label="Normal" />
                                            <FormControlLabel value={"Abnormal"} control={<Radio />} label="Abnormal" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RadioGroup
                                            row onChange={e => { setPresentPregnancy({ ...presentPregnancy, presentationFoetalMovement: e.target.value }) }}
                                        >
                                            <FormControlLabel sx={{ width: "39%" }} control={<FormLabel />} label="Foetal movement: " />
                                            <FormControlLabel value={"Normal"} control={<Radio />} label="Normal" />
                                            <FormControlLabel value={"Abnormal"} control={<Radio />} label="Abnormal" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Next Visit"
                                            inputFormat="yyyy-MM-dd"
                                            value={patient.dob || new Date()}
                                            onChange={e => { setPresentPregnancy({ ...presentPregnancy, presentationNextVisit: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Next Visit"
                                                inputFormat="yyyy-MM-dd"
                                                value={patient.dob || new Date()}
                                                onChange={e => { setPresentPregnancy({ ...presentPregnancy, presentationNextVisit: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { savePresentPregnancy() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                            <TabPanel value='2'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Infant Feeding</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            <FormControlLabel value={0} control={<FormLabel />} label="Infant feeding counseling done: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            <FormControlLabel value={0} control={<FormLabel />} label="Counseling on exclusive breastfeeding and benefits of colostrum done: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveSuccessfully() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                        </TabContext>
                        <Modal
                            keepMounted
                            open={openModal}
                            sx={{ overflow: "scroll" }}
                            onClose={handleClose}
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




