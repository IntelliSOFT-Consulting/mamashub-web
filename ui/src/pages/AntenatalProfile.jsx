import { Container, Modal, CircularProgress, FormGroup, Checkbox, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
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
import CurrentPatient from '../components/CurrentPatient'


export default function AntenatalProfile() {

    let [visit, setVisit] = useState()
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [data, setData] = useState({})
    let [message, setMessage] = useState(false)
    let [observations, setObservations] = useState([])
    let isMobile = useMediaQuery('(max-width:600px)');
    let [antenatalProfile, setAntenatalProfile] = useState({})
    const handleClose = () => setOpenModal(false);
    const handleOpen = () => setOpenModal(true);
    let [openModal, setOpenModal] = useState(false)
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
    const handleChanges = (event) => {
        console.log(event);
        return
    };

    let saveantenatalProfile = async () => {
        //get current patient
        if (!visit) {
            prompt("No patient visit not been initiated. To start a visit, Select a patient in the Patient's list")
            return
        }
        let patient = visit.id
        try {
            //create Encounter
            let encounter = await createEncounter(patient, "MEDICAL_HISTORY")
            console.log(encounter)

            //Create and Post Observations
            let res = await (await fetch(`${apiHost}/crud/observations`, {
                method: "POST",
                body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: antenatalProfile }),
                headers: { "Content-Type": "application/json" }
            })).json()
            console.log(res)

            if (res.status === "success") {
                prompt("Medical History saved successfully")
                // setValue('2')
                return
            } else {
                prompt(res.error)
                return
            }
        } catch (error) {
            console.error(error)
            // prompt(JSON.stringify(error))
            return
        }
    }


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
            body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: antenatalProfile }),
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
            window.localStorage.setItem("next_page", "/antenatal-profile")
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
                                    <Tab label="Antenatal Profile" value="1" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant="h6">Blood Tests</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, hbTest: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Hb Test: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        {(antenatalProfile.hbTest && antenatalProfile.hbTest === "Yes") && <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="If yes, specify reading"
                                            placeholder="If yes, specify reading"
                                            size="small"
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, hbTestReading: e.target.value }) }}
                                        />}
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup row onChange={e => { setAntenatalProfile({ ...antenatalProfile, bloodGroupTest: e.target.value }) }}>
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Blood Group Test: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup row onChange={e => { setAntenatalProfile({ ...antenatalProfile, bloodGroup: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Blood Group: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup row onChange={e => { setAntenatalProfile({ ...antenatalProfile, rhesusTest: e.target.value }) }}>
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Rhesus Test: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={10}>
                                        <RadioGroup row onChange={e => { setAntenatalProfile({ ...antenatalProfile, rhesusFactor: e.target.value }) }}>
                                            <FormControlLabel value={0} sx={{ width: "30%" }} control={<FormLabel />} label="Rhesus Factor: " />
                                            <FormControlLabel value={"Rh Positive"} control={<Radio />} label="Rh Positive" />
                                            <FormControlLabel value={"Rh Negative"} control={<Radio />} label="Rh Negative" />
                                        </RadioGroup>
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, bloodRBSTest: e.target.value }) }}
                                        >

                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Blood RBS Test: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Urine Test</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" ></Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <RadioGroup
                                        row onChange={e => { setAntenatalProfile({ ...antenatalProfile, urineTest: e.target.value }) }}
                                    >
                                        <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Urinalysis Test" />
                                        <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                        <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <RadioGroup
                                        row onChange={e => { setAntenatalProfile({ ...antenatalProfile, urineTestResultsAbnormality: e.target.value }) }}
                                    >
                                        <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="If yes, test results: " />
                                        <FormControlLabel value={"Normal"} control={<Radio />} label="Normal" />
                                        <FormControlLabel value={"Abnormal"} control={<Radio />} label="Abnormal" />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12} md={12} lg={7}>
                                    <TextField
                                        fullWidth="90%"
                                        type="text"
                                        label="If abnormal, state the abnormality: "
                                        placeholder="If abnormal, state the abnormality: "
                                        size="small"
                                        onChange={e => { setAntenatalProfile({ ...antenatalProfile, urinalysisTestAbnormality: e.target.value }) }}
                                    />
                                </Grid>

                                <Divider />
                                <p></p>

                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>TB Screening</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup row onChange={e => { setAntenatalProfile({ ...antenatalProfile, tbScreening: e.target.value }) }}>
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="TB Screening: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup row onChange={e => { setAntenatalProfile({ ...antenatalProfile, tbScreeningResults: e.target.value }) }}>
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="If yes, TB Results: " />
                                            <FormControlLabel value={"Positive"} control={<Radio />} label="Positive" />
                                            <FormControlLabel value={"Negative"} control={<Radio />} label="Negative" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If positive, send for TB Diagnosis"
                                            placeholder="If positive, send for TB Diagnosis"
                                            size="small"
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, specificDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If negative, give IPT as per eligibility"
                                            placeholder="If negative, give IPT as per eligibility"
                                            size="small"
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, specificDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="IPT Date given"
                                            inputFormat="MM/dd/yyyy"
                                            value={antenatalProfile.iptDateGiven || null}
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, iptDateGiven: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="IPT Date given"
                                                inputFormat="MM/dd/yyyy"
                                                value={antenatalProfile.iptDateGiven || null}
                                                onChange={e => { setAntenatalProfile({ ...antenatalProfile, iptDateGiven: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="IPT next visit"
                                            inputFormat="MM/dd/yyyy"
                                            value={antenatalProfile.iptNextVisit || null}
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, iptNextVisit: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="IPT next visit"
                                                inputFormat="MM/dd/yyyy"
                                                value={antenatalProfile.iptNextVisit || null}
                                                onChange={e => { setAntenatalProfile({ ...antenatalProfile, iptNextVisit: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup row onChange={e => { setAntenatalProfile({ ...antenatalProfile, nonDrugAllergies: e.target.value }) }}>
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Other non-drug allergies: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, specificNonDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Family History</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, specificNonDrugAllergies: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Twins: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row onChange={e => { setAntenatalProfile({ ...antenatalProfile, familyHistoryTB: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Tuberculosis: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If yes, who is the relative who contacted TB"
                                            placeholder="If yes, who is the relative who contacted TB"
                                            size="small"
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, familyHistoryTBName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="Relationship"
                                            placeholder="Relationship"
                                            size="small"
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, familyHistoryTBRelationship: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row onChange={e => { setAntenatalProfile({ ...antenatalProfile, familyLivingInSameHousehold: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Were they living in the same household: " />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If yes, refer for TB screening"
                                            placeholder="If yes, refer for TB screening"
                                            size="small"
                                            onChange={e => { setAntenatalProfile({ ...antenatalProfile, referForTBScreening: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }} onClick={e => { setAntenatalProfile({}) }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveantenatalProfile() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
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




