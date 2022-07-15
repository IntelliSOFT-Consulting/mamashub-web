import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, FormControl, InputLabel, Select, MenuItem, FormGroup, Checkbox } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Patient } from '../lib/fhir/resources'
import { v4 as uuidv4 } from 'uuid';
import { FhirApi, apiHost } from './../lib/api'
import * as qs from 'query-string';
import { DataGrid } from '@mui/x-data-grid';
import counties from '../data/counties.json'
import countyMap from '../data/code_to_counties_map.json'
import subCountyMap from '../data/code_to_constituencies_map.json'
import wardMap from '../data/code_to_wards_map.json'
import countyToConstituency from '../data/county_to_consituencies.json'
import consituencyToWard from '../data/consituencies_to_ward.json'
import { startVisit } from '../lib/startVisit'

export default function PatientRegistration() {

    let [patient, setPatient] = useState({});
    let [open, setOpen] = useState(false);
    let [data, setData] = useState({});
    let [message, setMessage] = useState(false);
    let [selectedCounty, setCounty] = useState('');
    let [selectedConsituency, setConstituency] = useState('');
    let [patients, setPatients] = useState({});
    let [selectionModel, setSelectionModel] = useState([]);
    let navigate = useNavigate();
    let [observations, setObservations] = useState({})
    let isMobile = useMediaQuery('(max-width:600px)');
    const [value, setValue] = useState('1');

    

    let displayAlert = async (message) => {
        setMessage(message);
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 1500);
        return
    }
    

    

    let createEncounter = async (patientId, encounterType = 1) => {
        try {
            let encounter = await (await fetch(`${apiHost}/crud/encounters`, {
                method: 'PUT',
                body: JSON.stringify({
                    encounterType: encounterType,
                    patientId: patientId
                }),
                headers: { "Content-Type": "application/json" }
            })).json()
            console.log(encounter)
            displayAlert(`Encounter created successfully`)

            return encounter.id
        } catch (error) {
            displayAlert("Failed to create encounter")
            return null
        }
    }
    let createObservations = async (observations) => {
        try {
            let o = await (await fetch(`${apiHost}/crud/observations`, {
                method: 'PUT',
                body: JSON.stringify(observations),
                headers: { "Content-Type": "application/json" }
            })).json()
            console.log(o)
            displayAlert(`Observations created successfully`)
            return o.id
        } catch (error) {
            displayAlert("Failed to create encounter")
            return null
        }
    }

    useEffect(() => {

    }, [patient.dob])

    useEffect(() => {
        let _edd = new Date(observations.lmp ? observations.lmp : new Date())
        _edd.setDate(_edd.getDate() + (36 * 7))
        console.log(_edd)
        setObservations({ ...observations, edd: _edd.toLocaleDateString('en-GB') })
        return
    }, [observations.lmp])


    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/patient-registration")
            return
        }
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        return
    };

    let registerPatient = async () => {
        try {
            let id = uuidv4()
            let response = await FhirApi({ url: `/fhir/Patient/${id}`, method: 'PUT', data: JSON.stringify(Patient({ ...patient, id: id })) })
            console.log(response)
            if (response.status === "success") {
                setOpen(false)
                setMessage("Patient created successfully")
                setOpen(true)
            }
            //Create Encounter
            // let patientId = id
            // let encounter = await createEncounter(patientId)
            // if (!encounter) {
            //     setOpen(false)
            //     setMessage("Failed to create Maternal Profile encounter")
            //     setOpen(true)
            //     return
            // }

            //Create and Post Observations
                let res = await (await fetch(`${apiHost}/crud/observations`, {
                    body: JSON.stringify({patientId, encounterId: encounter, observations:observations})
                })).json()
                console.log(res)

        
            if (res.status === "success") {
                setOpen(false)
                setMessage("Patient created successfully")
                setOpen(true)
            }
            navigate(`/patients/${id}`)
            return
        } catch (error) {
            setOpen(true)
            console.log(error)
            setMessage(String(error))
            return
        }
    }

    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/patient-registration")
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
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example">
                                    <Tab label="Maternal Profile" value="1" />
                                    
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}

                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="First Name"
                                            placeholder="First Name"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Last Name"
                                            placeholder="Last Name"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, lastName: e.target.value }) }}
                                        // onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Other Names"
                                            placeholder="Other Names"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, otherNames: e.target.value }) }}
                                        // onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date of birth"
                                            inputFormat="dd/MM/yyyy"
                                            value={patient.dob || null}
                                            onChange={e => { console.log(e); setPatient({ ...patient, dob: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date of birth"
                                                inputFormat="dd/MM/yyyy"
                                                value={patient.dob || null}
                                                onChange={e => { console.log(e); setPatient({ ...patient, dob: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={2}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Gravida"
                                            placeholder="Gravida"
                                            size="small"
                                            onChange={e => { setObservations({ ...observations, gravida: e.target.value }) }}
                                        // onChange={e=>{console.log(e)}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={2}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Parity"
                                            placeholder="Parity"
                                            size="small"
                                            onChange={e => { setObservations({ ...observations, parity: e.target.value }) }}
                                        // onChange={e=>{console.log(e)}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={2}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Height(cm)"
                                            placeholder="Height(cm)"
                                            size="small"
                                            onChange={e => { setObservations({ ...observations, bodyHeight: e.target.value }) }}
                                        // onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={2}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Weight (kg)"
                                            placeholder="Weight (kg)"
                                            size="small"
                                            onChange={e => { setObservations({ ...observations, bodyWeight: e.target.value }) }}
                                        // onChange={e=>{console.log(e)}}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="LMP"
                                            inputFormat="dd/MM/yyyy"
                                            value={observations.lmp || null}
                                            onChange={e => { console.log(e); setObservations({ ...observations, lmp: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="LMP"
                                                inputFormat="dd/MM/yyyy"
                                                value={observations.lmp || null}
                                                onChange={e => { console.log(e); setObservations({ ...observations, lmp: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    {observations.lmp && <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            value={observations.edd ? observations.edd : null}
                                            label="EDD"
                                            placeholder="EDD"
                                            size="small"
                                            onChange={e => { setObservations({ ...observations, edd: e.target.value }) }}
                                        // onChange={e=>{console.log(e)}}
                                        />
                                    </Grid>}
                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Address"
                                            placeholder="Address"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, address: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="phone"
                                            label="Phone Number"
                                            placeholder="Phone Number"
                                            size="small"
                                            onChange={e => { setObservations({ ...observations, patientPhoneNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Education Level</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.educationLevel ? patient.educationLevel : null}
                                                label="Education Level"
                                                onChange={e => { setPatient({ ...patient, educationLevel: e.target.value }) }}
                                                size="small"
                                                defaultValue={"Primary School"}
                                            >
                                                <MenuItem value={"Primary School"}>Primary School</MenuItem>
                                                <MenuItem value={"High School"}>High School</MenuItem>
                                                <MenuItem value={"Undergraduate"}>Undergraduate</MenuItem>
                                                <MenuItem value={"Postgraduate"}>Postgraduate</MenuItem>
                                                <MenuItem value={"Tertiary"}>Tertiary</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Residence</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">County</InputLabel>
                                            <Select
                                                // defaultValue={null}
                                                label="County"
                                                onChange={e => { setPatient({ ...patient, county: e.target.value }); console.log(e.target.value) }}
                                                size="small"
                                            >
                                                {counties && counties.map((county) => {
                                                    return <MenuItem key={county.code} value={county.code}>{county.name}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Sub-County</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.constituency}
                                                label="Sub-County"
                                                onChange={e => { setPatient({ ...patient, subCounty: e.target.value }) }}
                                                size="small"
                                            >
                                                {patient.county && countyToConstituency[patient.county].map((subCounty) => {
                                                    return <MenuItem key={subCounty.code} value={subCounty.code}>{subCounty.name}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Ward</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.ward}
                                                label="Ward"
                                                onChange={e => { setPatient({ ...patient, ward: e.target.value }) }}

                                                size="small"
                                            >
                                                {patient.subCounty && consituencyToWard[patient.subCounty].map((ward) => {
                                                    return <MenuItem key={ward.code} value={ward.code}>{ward.name}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Street"
                                            placeholder="Street"
                                            size="small"
                                            onChange={e => { console.log(e) }}
                                        />
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Next of kin</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Next of kin names"
                                            placeholder="Next of kin names"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, inpatientNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Relationship</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.nextOfKinRelationship ? patient.nextOfKinRelationship : ""}
                                                label="Relationship"
                                                onChange={e => { setPatient({ ...patient, nextOfKinRelationship: e.target.value }) }}
                                                size="small"
                                            // defaultValue={""}
                                            >
                                                <MenuItem value={"Spouse"}>Spouse</MenuItem>
                                                <MenuItem value={"Child"}>Child</MenuItem>
                                                <MenuItem value={"Parent"}>Parent</MenuItem>
                                                <MenuItem value={"Relatives"}>Relatives</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Next of Kin's contact/phone no."
                                            placeholder="Next of Kin's contact/phone no."
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, contactPhoneNumber: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider />
                                <p></p>

                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Woman wants to receive reminders during pregnancy" />
                                </FormGroup>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { registerPatient() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
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




