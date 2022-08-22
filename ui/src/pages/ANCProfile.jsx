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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { v4 as uuidv4 } from 'uuid'
import { createEncounter, FhirApi, apiHost } from '../lib/api'
import { Patient } from '../lib/fhir/resources'
import CurrentPatient from '../components/CurrentPatient'


export default function ANCProfile() {

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


    const [value, setValue] = useState('1');

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
                                    <Tab label="Medical and Surgical History" value="1" />

                                    <Tab label="Birth Plan" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant="h5">Surgical History</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            defaultChecked={true}
                                            onChange={e => { setPatientInformation({ ...patientInformation, surgicalOperation: e.target.value }); console.log(e.target.value) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Surgical Operation: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        {(patientInformation.surgicalOperation) && <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Specify"
                                            placeholder="Specify"
                                            size="small"
                                            onChange={e => { setPatientInformation({ ...patientInformation, surgicalOperationReason: e.target.value }) }}
                                        />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                            <FormLabel component="legend">Surgical Operation (Select all that apply)</FormLabel>
                                            <FormGroup>
                                                <FormControlLabel label="No known past surgeries"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="jason" />
                                                    }
                                                />
                                                <FormControlLabel label="Dilation and curettage"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="Myomectomy"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="Removal of ovarian cysts"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="Oophorectomy"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="Salpingectomy"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="Cervical Cone"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Other gynaecological procedures (specify)"
                                            placeholder="Other gynaecological procedures (specify)"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, specifyDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Other surgeries (specify)"
                                            placeholder="Other surgeries (specify)"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, specifyDrugAllergies: e.target.value }) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { setPatientInformation({ ...patientInformation, diabetes: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Diabetes: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
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
                                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                            <FormLabel component="legend">If yes, select all that apply</FormLabel>
                                            <FormGroup>

                                                <FormControlLabel label="Epilepsy"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="Malaria in pregnancy"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                                <FormControlLabel label="Others"
                                                    control={
                                                        <Checkbox checked={false} onChange={handleChanges} name="antoine" />
                                                    }
                                                />
                                            </FormGroup>
                                        </FormControl>
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
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="If yes, was there a reaction? " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={7}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If yes, what was the reaction"
                                            placeholder="If yes, what was the reaction"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Tuberculosis: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>

                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Drug Allergies</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { setPatientInformation({ ...patientInformation, drugAllergies: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Drug allergies: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { setPatientInformation({ ...patientInformation, drugAllergies: e.target.value }) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Other non-drug allergies: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="90%"
                                            type="text"
                                            label="If yes, specify"
                                            placeholder="If yes, specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
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
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >
                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Twins: " />
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

                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Tuberculosis: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>



                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveMedicalHistory() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>

                            <TabPanel value='2'>

                                <Grid container spacing={1} padding=".5em" >


                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="EDD"
                                            inputFormat="MM/dd/yyyy"
                                            value={patient.edd}
                                            onChange={e => { console.log(e); setPatient({ ...patient, edd: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="EDD"
                                                inputFormat="mm/dd/yyyy"
                                                value={patient.edd}
                                                onChange={e => { console.log(e); setPatient({ ...patient, edd: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={8}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Birth Attendant"
                                            placeholder="Birth Attendant"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Support Person / Birth Companion"
                                            placeholder="Support Person / Birth Companion"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Health Facility Contact"
                                            placeholder="Health Facility Contact"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Transport"
                                            placeholder="Transport"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Blood Donor"
                                            placeholder="Blood Donor"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Financial Plan for childbirth"
                                            placeholder="Financial Plan for childbirth"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>


                                <p></p>
                                <Divider />

                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveBirthPlan() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
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




