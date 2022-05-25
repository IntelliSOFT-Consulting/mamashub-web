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
import countyToConstituency from '../data/county_to_consituencies.json'
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

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    let savePatientDetails = async () => {

        let response = await(await fetch('/patients', {
            body:JSON.stringify({})
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
                                    <Tab label="Maternity Registration" value="1" />
                                    <Tab label="Delivery Details" value="2" />
                                    <Tab label="Newborn Registration" value="3" />
                                    <Tab label="Mother's Health Assessment" value="4" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Biodata</Typography>
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
                                            onChange={e=>{setPatient({...patient, dob: e})}}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date of birth"
                                                inputFormat="MM/dd/yyyy"
                                                value={patient.dob}
                                            onChange={e=>{setPatient({...patient, dob: e})}}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Inpatient Number"
                                            placeholder="Inpatient Number"
                                            size="small"
                                            onChange={e => { setPatient({ ...patient, inpatientNumber: e.target.value }) }}
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
                                                    onChange={e=>{console.log(e)}}
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
                                                    onChange={e=>{console.log(e)}}

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
                                                    onChange={e=>{console.log(e)}}
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
                                        onChange={e=>{console.log(e)}}
                                        />
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Pregnancy Details</Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Gravidity"
                                            placeholder="Gravidity"
                                            size="small"
                                        onChange={e=>{console.log(e)}}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Parity"
                                            placeholder="Parity"
                                            size="small"
                                        onChange={e=>{console.log(e)}}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="LNMP"
                                            placeholder="LNMP"
                                            size="small"
                                        onChange={e=>{console.log(e)}}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="EDD"
                                            placeholder="EDD"
                                            size="small"
                                        onChange={e=>{console.log(e)}}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Gestation"
                                            placeholder="Gestation (weeks)"
                                            size="small"
                                        onChange={e=>{console.log(e)}}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                    <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">HIV Status</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="HIV Status"
                                                size="small"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Positive</MenuItem>
                                                <MenuItem value={20}>Negative</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                </Grid>

                                <p></p>

                                <Divider />
                                <p></p>

                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#8A5EB5" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>
                            <TabPanel value='2'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Mother Delivery Details</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Labor Stage</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Labor Stage"
                                                size="small"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">ROM</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="ROM"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Delivery Method</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Delivery Method"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="If CS, reason"
                                            placeholder="If CS, reason"
                                            size="small"
                                        onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Is Placenta Complete?</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Delivery Method"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <p></p>

                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}></Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Resuscitation</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Resuscitation"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Has the baby been given vitamin K</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Has the baby been given vitamin K"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Does the baby show signs of prophylaxis? 1% TED</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Does the baby show signs of prophylaxis? 1% TED"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Baby Status</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Baby Status"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#8A5EB5" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                            <TabPanel value='3'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Newborn Registration</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date of birth"
                                            inputFormat="MM/dd/yyyy"
                                            value={value}
                                            onChange={handleChange}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date of birth"
                                                inputFormat="MM/dd/yyyy"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Baby's Gender</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Labor Stage"
                                                size="small"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={"Male"}>Male</MenuItem>
                                                <MenuItem value={"Female"}>Female</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Baby's Inpatient Number"
                                            placeholder="Baby's Inpatient Number"
                                            size="small"
                                        onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                </Grid>

                                <Divider />
                                <Typography variant='p' sx={{ fontSize: 'medium', fontWeight: 'bold', p: '1em' }}>Baby Details</Typography>

                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Gestation period at birth (weeks)"
                                            placeholder="Gestation period at birth (weeks)"
                                            size="small"
                                        onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={8} >
                                        <Card sx={{border:"1px solid black"}}> 
                                        <CardContent sx={{alignContent:"center", textAlign:"center"}}>
                                        <Typography variant='h5' sx={{textDecoration:"underline"}}>Apgar Chart</Typography>

                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                            >
                                                <FormControlLabel value={0} control={<FormLabel  />} label="Activity: " />
                                                 
                                                <FormControlLabel value={0} control={<Radio />} label="0 points" />
                                                <FormControlLabel value={1} control={<Radio />} label="1 point" />
                                                <FormControlLabel value={2} control={<Radio />} label="2 points" />
                                                
                                            </RadioGroup>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                            >
                                                <FormControlLabel value={0} control={<FormLabel  />} label="Pulse: " />

                                                <FormControlLabel value={0} control={<Radio />} label="0 points" />
                                                <FormControlLabel value={1} control={<Radio />} label="1 point" />
                                                <FormControlLabel value={2} control={<Radio />} label="2 points" />
                                                
                                            </RadioGroup>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                            >
                                                <FormControlLabel value={0} control={<FormLabel  />} label="Grimace: " />

                                                <FormControlLabel value={0} control={<Radio />} label="0 points" />
                                                <FormControlLabel value={1} control={<Radio />} label="1 point" />
                                                <FormControlLabel value={2} control={<Radio />} label="2 points" />
                                                
                                            </RadioGroup>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                            >
                                                <FormControlLabel value={0} control={<FormLabel  />} label="Appearance: " />

                                                <FormControlLabel value={0} control={<Radio />} label="0 points" />
                                                <FormControlLabel value={1} control={<Radio />} label="1 point" />
                                                <FormControlLabel value={2} control={<Radio />} label="2 points" />
                                                
                                            </RadioGroup>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                            >
                                                <FormControlLabel value={0} control={<FormLabel  />} label="Respiration: " />

                                                <FormControlLabel value={0} control={<Radio />} label="0 points" />
                                                <FormControlLabel value={1} control={<Radio />} label="1 point" />
                                                <FormControlLabel value={2} control={<Radio />} label="2 points" />
                                                
                                            </RadioGroup>
                                        </FormControl>
                                        </CardContent>
                                        
                                        </Card>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <Typography variant='p' sx={{ fontSize: 'medium', fontWeight: 'bold', p: '1em' }}>Vital Signs</Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Current Temperature"
                                            placeholder="Current Temperature"
                                            size="small"
                                        onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Birth Weight (g)"
                                            placeholder="Birth Weight (g)"
                                            size="small"
                                        onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                </Grid>
                                <Divider />
                                <Typography variant='p' sx={{ fontSize: 'medium', fontWeight: 'bold', p: '1em' }}>Place of birth</Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">BBA</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.bba ? data.bba : "No"}
                                                label="BBA"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="If BBA, where?"
                                            placeholder="If BBA, where?"
                                            size="small"
                                        onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                </Grid>
                                <Divider />
                                <Typography variant='p' sx={{ fontSize: 'medium', fontWeight: 'bold', p: '1em' }}>Reasons for Admission</Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={4}
                                            label="Mother's Health Status"
                                            placeholder="Mother's Health Status"
                                            size="small"
                                        onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <p></p>
                                        <p></p>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Admitted From</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.admittedFrom ? data.admittedFrom : "No"}
                                                label="Admitted From"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={"Yes"}>1</MenuItem>
                                                <MenuItem value={"No"}>2</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <p></p>
                                        <p></p>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Completed By"
                                            placeholder="Completed By"
                                            size="small"
                                        onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#8A5EB5" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>



                            {/* 4 - Mothers Health Assessment  */}
                            <TabPanel value='4'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Mother's Health Assessment</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={4}
                                            label="Mother's Health Status"
                                            placeholder="Mother's Health Status"
                                            size="small"
                                        onChange={e=>{console.log(e)}}


                                        />
                                    </Grid>
                                </Grid>
                                <p></p>

                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}></Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Does mother have any breast problems?</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Resuscitation"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>


                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Is the mother well?</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Baby Status"
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#8A5EB5" }}>Save</Button>
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




