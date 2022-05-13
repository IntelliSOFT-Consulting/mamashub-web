import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'


export default function NewBornUnit({ id }) {

    let [patient, setPatient] = useState({})
    let [data, setData] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList
                                        value={value}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        aria-label="scrollable auto tabs example">
                                        <Tab label="Rapid Assessment" value="1" />
                                        <Tab label="Newborn Admission" value="2" />
                                        <Tab label="Feeding Needs Assessment" value="3" />
                                        <Tab label="Prescribe Feeds" value="4" />
                                        <Tab label="Record Feeding Data" value="5" />
                                        <Tab label="Health Information Monitoring" value="6" />
                                    </TabList>
                                </Box>

                                {/* 1. Rapid Assessment */}
                                <TabPanel value="1">
                                    {/* <p></p> */}
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Rapid Assessment</Typography>
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
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                                    </Stack>
                                    <p></p>
                                </TabPanel>

                                {/* Newborn Admission  */}
                                <TabPanel value="2">
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Newborn Admission</Typography>
                                    <Divider />
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                multiline
                                                minRows={4}
                                                label="Preventive Care Given"
                                                placeholder="Preventive Care Given"
                                                size="small"
                                            onChange={e=>{console.log(e)}}


                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Birth weight (g)"
                                                placeholder="Birth weight (g)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                    </Grid>
                                    <p></p>
                                    <Divider />
                                    <Typography variant='p' sx={{ fontSize: 'medium', fontWeight: 'bold', p: '1em' }}>Vitals</Typography>

                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={4}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Admission weight (g)"
                                                placeholder="Admission weight (g)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={4}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Baby's length (cm)"
                                                placeholder="Baby's length (cm)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={4}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Head Circumference (cm)"
                                                placeholder="Head Circumference (cm)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Temp(c)"
                                                placeholder="Temp(c)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Pulse (per min)"
                                                placeholder="Pulse (per min)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Respiration rate(bpm)"
                                                placeholder="Respiration rate(bpm)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Oxygen Sat(%)"
                                                placeholder="Oxygen Sat(%)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>


                                    </Grid>
                                    <p></p>
                                    <Divider />
                                    <Typography variant='p' sx={{ fontSize: 'medium', fontWeight: 'bold', p: '1em' }}>Baby Details</Typography>

                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Fever</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.Fever ? data.Fever : "No"}
                                                    label="Fever"
                                                    onChange={handleChange}
                                                    size="small"
                                                >
                                                    <MenuItem value={"Yes"}>Yes</MenuItem>
                                                    <MenuItem value={"No"}>No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Convulsions</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.Convulsions ? data.Convulsions : "No"}
                                                    label="Convulsions"
                                                    onChange={handleChange}
                                                    size="small"
                                                >
                                                    <MenuItem value={"Yes"}>Yes</MenuItem>
                                                    <MenuItem value={"No"}>No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={4}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Difficulty Breathing</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.Difficulty ? data.Difficulty : "No"}
                                                    label="Difficulty Breathing"
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
                                                <InputLabel id="demo-simple-select-label">Apnoea</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.Apnoea ? data.Apnoea : "No"}
                                                    label="Apnoea"
                                                    onChange={handleChange}
                                                    size="small"
                                                >
                                                    <MenuItem value={"Yes"}>Yes</MenuItem>
                                                    <MenuItem value={"No"}>No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TimePicker
                                                label="Time baby was born"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField size='small' {...params} />}
                                            />
                                        </Grid>
                                    </Grid>
                                    <p></p>
                                    <Divider />
                                    <p></p>
                                    <Stack direction="row" spacing={2} alignContent="right" >
                                        {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                        <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                                    </Stack>
                                    <p></p>

                                </TabPanel>


                                {/* Feeding Needs Assessment  */}
                                <TabPanel value="3">
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Feeding Needs Assessment</Typography>
                                    <Divider />
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Last Name"
                                                placeholder="Last Name"
                                                size="small"
                                            onChange={e=>{console.log(e)}}


                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Hospital Name"
                                                placeholder="Hospital Name"
                                                size="small"
                                            onChange={e=>{console.log(e)}}


                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            {!isMobile ? <DesktopDatePicker
                                                label="Date of admission"
                                                inputFormat="MM/dd/yyyy"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            /> :
                                                <MobileDatePicker
                                                    label="Date of admission"
                                                    inputFormat="MM/dd/yyyy"
                                                    value={value}
                                                    onChange={handleChange}
                                                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                                />}
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
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
                                        <Grid item xs={12} md={12} lg={6}>
                                            {!isMobile ? <DesktopDatePicker
                                                label="Date today"
                                                inputFormat="MM/dd/yyyy"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            /> :
                                                <MobileDatePicker
                                                    label="Date today"
                                                    inputFormat="MM/dd/yyyy"
                                                    value={value}
                                                    onChange={handleChange}
                                                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                                />}
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.labor_stage ? data.labor_stage : 1}
                                                    label="Gender"
                                                    onChange={handleChange}
                                                    size="small"
                                                >
                                                    <MenuItem value={10}>Male</MenuItem>
                                                    <MenuItem value={20}>Female</MenuItem>
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
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                                    </Stack>
                                    <p></p>
                                </TabPanel>

                                {/* Prescribe Feeds  */}
                                <TabPanel value="4">
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Prescribe Feeds</Typography>
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
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                                    </Stack>
                                    <p></p>
                                </TabPanel>

                                {/* Recording Feeding Data */}
                                <TabPanel value="5">
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Recording Feeding Data</Typography>
                                    <Divider />
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={6}>
                                            {!isMobile ? <DesktopDatePicker
                                                label="Date"
                                                inputFormat="MM/dd/yyyy"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            /> :
                                                <MobileDatePicker
                                                    label="Date"
                                                    inputFormat="MM/dd/yyyy"
                                                    value={value}
                                                    onChange={handleChange}
                                                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                                />}
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TimePicker
                                                label="Time"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField size='small' {...params} />}
                                            />
                                        </Grid>

                                    </Grid>
                                    <p></p>

                                    <Divider />
                                    <Typography variant='p' sx={{ fontSize: 'small', fontWeight: 'bold' }}>Input</Typography>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Method 1 of feeding"
                                                placeholder="Method 1 of feeding"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Method 2 of feeding"
                                                placeholder="Method 2 of feeding"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Amount offered (ml)"
                                                placeholder="Amount offered (ml)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Amount offered (ml)"
                                                placeholder="Amount offered (ml)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Amount taken (ml)"
                                                placeholder="Amount taken (ml)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Amount taken (ml)"
                                                placeholder="Amount taken (ml)"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>


                                    </Grid>
                                    <p></p>
                                    <Divider />
                                    <Typography variant='p' sx={{ fontSize: 'small', fontWeight: 'bold' }}>Output</Typography>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={8}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Urine</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.labor_stage ? data.labor_stage : 1}
                                                    label="Urine"
                                                    onChange={handleChange}
                                                    size="small"
                                                >
                                                    <MenuItem value={"Yes"}>Yes</MenuItem>
                                                    <MenuItem value={"No"}>No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Stool</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.labor_stage ? data.labor_stage : 1}
                                                    label="Stool"
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
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Current Weight"
                                                placeholder="Current Weight"
                                                size="small"
                                            onChange={e=>{console.log(e)}}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={4}
                                            label="Remarks"
                                            placeholder="Remarks"
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
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                                    </Stack>
                                    <p></p>
                                </TabPanel>

                                {/* Health Information Monitoring  */}
                                <TabPanel value="6">
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Health Information Monitoring</Typography>
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
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                                    </Stack>
                                    <p></p>
                                </TabPanel>


                            </TabContext>
                        </Box>



                    </Container>
                </Layout>
            </LocalizationProvider>



        </>
    )

}




