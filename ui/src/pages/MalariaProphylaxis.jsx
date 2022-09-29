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


export default function MalariaProphylaxis() {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [malariaProphylaxis, setMalariaProphylaxis] = useState({})
    let [malariaProphylaxisList, setMalariaProphylaxisList] = useState([])
    let [notes, setNotes] = useState('')

    let malariaProphylaxisContacts = {
        "Upto 12 weeks": "-",
        "13-16 weeks": "IPTp - SP dose 1",
        "20 weeks": "IPTp - SP dose 2",
        "26 weeks": "IPTp - SP dose 3",
        "30 weeks": "IPTp - SP dose 4",
        "34 weeks": "IPTp - SP dose 5",
        "36 weeks": "No SP, if last dose received <1 Month ago",
        "38 weeks": "IPTp - SP dose 6 (if no dose in past month)",
        "40 weeks": "-"
    }




    let [visit, setVisit] = useState()
    let [data, setData] = useState({})
    let [preventiveService, setPreventiveService] = useState(null)
    let [maternalSerology, setMaternalSerology] = useState({})
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');



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

                                    <Tab label="Malaria Prophylaxis" value="1" />

                                </TabList>
                            </Box>



                            {/* Malaria Prophylaxis */}
                            <TabPanel value='1'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>ANC Visit</Typography>
                                <Divider />
                                {malariaProphylaxis.malariaProphylaxisTimingOfContact && <><p></p>
                                    <Alert severity="info">{malariaProphylaxis.malariaProphylaxisTimingOfContact}</Alert>
                                    <p></p>
                                </>}

                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Timing of Contact</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={malariaProphylaxis.malariaProphylaxisTimingOfContact || ""}
                                                label="Timing of contact"
                                                placeholder='Timing of contact'
                                                onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, malariaProphylaxisTimingOfContact: e.target.value }); console.log(e.target.value) }}
                                                size="small"
                                            >
                                                {Object.keys(malariaProphylaxisContacts).map((service) => {
                                                    return <MenuItem value={malariaProphylaxisContacts[service]}>{service}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                {/* <Divider /> */}
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    {malariaProphylaxis.malariaProphylaxisTimingOfContact && <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, cvs: e.target.value }) }}
                                        >
                                            <FormControlLabel sx={{ width: "40%" }} control={<FormLabel />} label={`${malariaProphylaxis.malariaProphylaxisTimingOfContact}:` || ""} />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>}

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date given"
                                            inputFormat="MM/dd/yyyy"
                                            value={malariaProphylaxis.dateGiven ? malariaProphylaxis.dateGiven : null}
                                            onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, dateGiven: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date given"
                                                inputFormat="MM/dd/yyyy"
                                                value={malariaProphylaxis.dateGiven ? malariaProphylaxis.dateGiven : null}
                                                onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, dateGiven: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Next visit"
                                            inputFormat="MM/dd/yyyy"
                                            value={malariaProphylaxis.nextVisitDate || null}
                                            onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, nextVisitDate: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Next visit"
                                                inputFormat="MM/dd/yyyy"
                                                value={malariaProphylaxis.nextVisitDate || null}
                                                onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, nextVisitDate: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Long Lasting Insecticide Treated Net</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, cvs: e.target.value }) }}
                                        >
                                            <FormControlLabel sx={{ width: "40%" }} control={<FormLabel />} label="Was LLITN given to the mother?" />
                                            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"No"} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="If yes, date given"
                                            inputFormat="MM/dd/yyyy"
                                            value={malariaProphylaxis.deworming ? malariaProphylaxis.deworming : null}
                                            onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, deworming: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="If yes, date given"
                                                inputFormat="MM/dd/yyyy"
                                                value={malariaProphylaxis.deworming ? malariaProphylaxis.deworming : null}
                                                onChange={e => { setMalariaProphylaxis({ ...malariaProphylaxis, deworming: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                </Grid>
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
                    </Container>
                
            </LocalizationProvider>
        </>
    )

}




