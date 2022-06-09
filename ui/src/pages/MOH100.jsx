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

import counties from '../data/counties.json'
import consituencyToWard from '../data/consituencies_to_ward.json'
import consituencies from '../data/constituencies.json'
import wards from '../data/wards.json'


export default function MaternityUnit({ id }) {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [data, setData] = useState({})
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');
    let saveReferralForm = async () => {


    }

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

    useEffect(() => {
        getPatientDetails(id)
    }, [])
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
                                    <Tab label="SECTION A: Patient / Client Data" value="1" />
                                    <Tab label="SECTION B: Referral Back to the Community" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>SECTION A: Patient / Client Data</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="First Name"
                                            placeholder="First Name"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
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
                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date of birth"
                                            inputFormat="MM/dd/yyyy"
                                            value={patient.dob}
                                            onChange={e => { setPatient({ ...patient, dob: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date of birth"
                                                inputFormat="MM/dd/yyyy"
                                                value={patient.dob}
                                                onChange={e => { setPatient({ ...patient, dob: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Sex</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.sex ? patient.sex : ""}
                                                label="Sex"
                                                onChange={e => { setPatient({ ...patient, sex: e.target.value }) }}
                                                size="small"
                                                defaultValue={"Female"}
                                            >
                                                <MenuItem value={"Male"}>Male</MenuItem>
                                                <MenuItem value={"Female"}>Female</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Reason(s) for Referral"
                                            placeholder="Reason(s) for Referral"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, reasonsForReferral: e.target.value }) }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Main Problems"
                                            placeholder="Main Problems"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, mainProblems: e.target.value }) }}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Treatment Given"
                                            placeholder="Treatment Given"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, treatmentGiven: e.target.value }) }}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Comments"
                                            placeholder="Comments"
                                            size="small"
                                            onChange={e => { console.log(e) }}

                                        />
                                    </Grid>
                                </Grid>

                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Residence</Typography>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">County</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.county}
                                                label="County"
                                                onChange={e => { console.log(e) }}
                                                size="small"
                                            >
                                                {counties && counties.map((county) => {
                                                    return <MenuItem value={county.code}>{county.name}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Constituency</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.constituency}
                                                label="Constituency"
                                                onChange={e => { setPatient({ ...patient, consituency: e.target.value }) }}
                                                size="small"
                                            >
                                                {consituencies && consituencies.map((county) => {
                                                    return <MenuItem value={county.code}>{county.name}</MenuItem>

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
                                                onChange={e => { console.log(e) }}
                                                size="small"
                                            >
                                                {wards && wards.map((county) => {
                                                    return <MenuItem value={county.code}>{county.name}</MenuItem>

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
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>SECTION B: Referral back to the Community</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Call made by referring officer</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.callMadeByReferringOfficer ? data.callMadeByReferringOfficer : "No"}
                                                label="Call made by referring officer"
                                                onChange={e => { setPatient({ ...patient, callMadeByReferringOfficer: e.target.value }) }}

                                                size="small"
                                                defaultValue={"Yes"}
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={8}>
                                        <br />
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            readonly
                                            multiline
                                            minRows={3}
                                            label="Kindly do the following to the patient"
                                            placeholder="Kindly do the following to the patient"
                                            size="small"
                                            onChange={e => { console.log(e) }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={8}>
                                        <br />
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            readonly
                                            multiline
                                            minRows={3}
                                            label="Signature"
                                            placeholder="Signature"
                                            size="small"
                                            // onChange={e=>{console.log(e)}}
                                            onChange={e => { setPatient({ ...patient, signature: e.target.value }) }}


                                        />
                                    </Grid>

                                </Grid>

                                <Grid container spacing={1} padding=".5em" >

                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveReferralForm() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
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
                </Layout>
            </LocalizationProvider>
        </>
    )

}




