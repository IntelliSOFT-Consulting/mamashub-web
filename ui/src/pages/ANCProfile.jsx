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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { v4 as uuidv4 } from 'uuid'
import { FhirApi } from '../lib/api'
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

    const [value, setValue] = useState('1');

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
        if(!visit){return}
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
                        {visit && <CurrentPatient data={visit}/>}
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example">
                                    <Tab label="Patient Information" value="1" />
                                    <Tab label="Medical History" value="2" />
                                    <Tab label="Birth Plan" value="3" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{width:"50%"}} control={<FormLabel />} label="Surgical Operation: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Specify"
                                            placeholder="Specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >

                                            <FormControlLabel value={0} sx={{width:"50%"}} control={<FormLabel />} label="Diabetes: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >

                                            <FormControlLabel value={0} sx={{width:"50%"}} control={<FormLabel />} label="Hypertension: " />
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

                                            <FormControlLabel value={0}  sx={{width:"50%"}} control={<FormLabel />} label="Any drug allergies: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Specify"
                                            placeholder="Specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>



                                <Divider />
                                <p></p>
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

                                            <FormControlLabel value={0} sx={{width:"50%"}} control={<FormLabel />} label="Twins: " />
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

                                            <FormControlLabel value={0}  sx={{width:"50%"}} control={<FormLabel />} label="Tuberculosis: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>

                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e=>{saveSuccessfully()}} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>
                            <TabPanel value='2'>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{width:"50%"}} control={<FormLabel />} label="HB: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Specify"
                                            placeholder="Specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Blood Group</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.bloodGroup ? patient.bloodGroup : null}
                                                label="Blood Group"
                                                onChange={e => { setPatient({ ...patient, bloodGroup: e.target.value }) }}
                                                size="small"
                                                defaultValue={"A"}
                                            >
                                                <MenuItem value={"A"}>A</MenuItem>
                                                <MenuItem value={"B"}>B</MenuItem>
                                                <MenuItem value={"AB"}>AB</MenuItem>
                                                <MenuItem value={"Positive"}>Positive</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Rhesus</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.rhesus ? patient.rhesus : null}
                                                label="Rhesus"
                                                onChange={e => { setPatient({ ...patient, rhesus: e.target.value }) }}
                                                size="small"
                                                defaultValue={"Negative"}
                                            >

                                                <MenuItem value={"Negative"}>Negative</MenuItem>
                                                <MenuItem value={"Positive"}>Positive</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{width:"50%"}} control={<FormLabel />} label="Urinalysis: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Specify"
                                            placeholder="Specify"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, surgicalOperationReason: e.target.value }) }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { setPatient({ ...patient, tbScreening: e.target.value }) }}

                                        >

                                            <FormControlLabel value={0} sx={{width:"50%"}} control={<FormLabel />} label="TB Screening: " />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Results</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={patient.tbResults ? patient.tbResults : null}
                                                label="Results"
                                                onChange={e => { setPatient({ ...patient, tbResults: e.target.value }) }}
                                                size="small"
                                                defaultValue={""}
                                            >

                                                <MenuItem value={"Positive"}>Positive</MenuItem>
                                                <MenuItem value={"Negative"}>Negative</MenuItem>
                                            </Select>
                                        </FormControl>
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
                                    <Button variant="contained" onClick={e=>{saveSuccessfully()}} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                            <TabPanel value='3'>

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
                                    <Button variant="contained" onClick={e=>{saveSuccessfully()}} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
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




