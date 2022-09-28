import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery, Radio, RadioGroup, Alert, FormControlLabel, FormLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, FormControl, InputLabel, Select, MenuItem, } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CurrentPatient from '../components/CurrentPatient'
import { createEncounter, apiHost } from '../lib/api'

export default function IFAS() {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [notes, setNotes] = useState('')


    let ifasList = {
        "0 - Upto 12 weeks gestation": "60 tablets",
        "1 - 12 weeks gestation": "56 tablets",
        "2 - 20 weeks gestation": "42 tablets",
        "3 - 26 weeks gestation": "28 tablets",
        "4 - 30 weeks gestation": "28 tablets",
        "5 - 34 weeks gestation": "14 tablets",
        "6 - 36 weeks gestation": "14 tablets",
        "7 - 38 weeks gestation": "14 tablets",
        "8 - 40 weeks gestation": "14 tablets",
    }



    let [visit, setVisit] = useState()
    let [notesDisplay, setNotesDisplay] = useState('')
    let [data, setData] = useState({})
    let [preventiveServices, setPreventiveServices] = useState({})

    let [ifas, setIfas] = useState()
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');

    let saveSerologyResults = async () => {


        return
    }

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
    useEffect(() => {
        let visit = window.localStorage.getItem("currentPatient")
        if (!visit) { return }
        setVisit(JSON.parse(visit))
        return
    }, [])


    let saveIFAS = async (patientId, code, observationValue) => {
        //get current patient
        let patient = visit.id
        if (!patient) {
            prompt("No patient visit not been initiated. To start a visit, Select a patient in the Patient's list")
            return
        }

        //create encounter
        let encounter = await createEncounter(patient, "IFAS")
        console.log(encounter)

        //save observations
        let observationsList = [
        ]
        //Create and Post Observations
        let res = await (await fetch(`${apiHost}/crud/observations`, {
            method: "POST",
            body: JSON.stringify({ patientId: patient, encounterId: encounter, observations: ifas }),
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
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example">
                                    <Tab label="IFAS" value="1" />

                                </TabList>
                            </Box>


                            <TabPanel value='1'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Iron and Folic Acid Supplementation</Typography>
                                <Divider />
                                {ifas && <><p></p>
                                    <Alert severity="info">{"Prescribe and dispense: " + ifas}</Alert>
                                    <p></p>
                                </>}
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Contacts</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={ifas ? ifas : ""}
                                                label="Iron and Folic Acid Supplementation"
                                                onChange={e => { setIfas(e.target.value); console.log(e.target.value) }}
                                                size="small"
                                            >
                                                {Object.keys(ifasList).map((service) => {
                                                    return <MenuItem value={ifasList[service]}>{service}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date given"
                                            inputFormat="yyyy-MM-dd"
                                            value={preventiveServices.dateGiven ? preventiveServices.dateGiven : null}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date given"
                                                inputFormat="yyyy-MM-dd"
                                                value={preventiveServices.dateGiven ? preventiveServices.dateGiven : null}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveIFAS() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>

                        </TabContext>
                    </Container>
                
            </LocalizationProvider>
        </>
    )

}




