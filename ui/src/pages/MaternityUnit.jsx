import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import countyToConstituency from './../data/county_to_consituencies.json'
import counties from './../data/counties.json'
import consituencyToWard from './../data/consituencies_to_ward.json'



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
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <TextField
                                        fullWidth="80%"
                                        type="text"
                                        label="Last Name"
                                        placeholder="Last Name"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} padding=".5em" >
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
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="Inpatient Number"
                                        placeholder="Inpatient Number"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider />
                            <p></p>
                            <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Residence</Typography>
                            <Grid container spacing={1} padding=".5em" >
                                <Grid item xs={12} md={12} lg={6}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="Region"
                                        placeholder="Region"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="County"
                                        placeholder="County"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="Ward"
                                        placeholder="Ward"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="Street"
                                        placeholder="Street"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

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
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="Parity"
                                        placeholder="Parity"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={4}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="LNMP"
                                        placeholder="LNMP"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={4}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="EDD"
                                        placeholder="EDD"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={4}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="Gestation"
                                        placeholder="Gestation (weeks)"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={4}>
                                    <TextField
                                        fullWidth="100%"
                                        type="text"
                                        label="HIV Status"
                                        placeholder="HIV Status"
                                        size="small"
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

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
                                    // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
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
                                <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                            </Stack>
                            <p></p>
                        </TabPanel>
                        <TabPanel value='3'>

                        </TabPanel>
                    </TabContext>
                </Container>
            </Layout>
            </LocalizationProvider>
        </>
    )

}




