import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery, FormControl, InputLabel, Select, MenuItem, } from '@mui/material'
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export default function HumanMilkBank({ id }) {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [data, setData] = useState(false)
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
                                        <Tab label="Consent Form" value="1" />
                                        <Tab label="Prescribe DHM" value="2" />
                                        <Tab label="Order Confirmation" value="3" />
                                        <Tab label="Update Recipient Register" value="4" />
                                        <Tab label="DHM Receival" value="5" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    {/* <p></p> */}
                                    <Typography variant='p'  sx={{ fontSize: 'large', fontWeight: 'bold' }}>Consent Form</Typography>

                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Recepients Name"
                                                placeholder="Recepients Name"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Hospital ID"
                                                placeholder="Hospital ID"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Legal Guardian Name"
                                                placeholder="Legal Guardian Name"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Legal Guardian Signature"
                                                placeholder="Legal Guardian Signature"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid> <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Clinician Name"
                                                placeholder="Clinician Name"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid> <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="100%"
                                                type="text"
                                                label="Clinician Designation"
                                                placeholder="Clinician Designation"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Consent Given</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.labor_stage ? data.labor_stage : 1}
                                                label="Consent Given"
                                                size="small"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Yes</MenuItem>
                                                <MenuItem value={20}>No</MenuItem>
                                            </Select>
                                        </FormControl>
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

                                {/* Prescribe DHM  */}
                                <TabPanel value="2">
                                    <Typography variant='p'  sx={{ fontSize: 'large', fontWeight: 'bold' }}>Prescribe DHM</Typography>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Gestation of Recipient"
                                                placeholder="Gestation of Recipient"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Location of Recepient"
                                                placeholder="Location of Recepient"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Volume per feed (mls/hr)"
                                                placeholder="Volume per feed (mls/hr)"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Preterm of term milk"
                                                placeholder="Preterm of term milk"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Name of prescriber"
                                                placeholder="Name of prescriber"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={6}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Nursing staff name"
                                                placeholder="Nursing staff name"
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

                                {/* Order Confirmation  */}
                                <TabPanel value="3">
                                    <Typography variant='p'  sx={{ fontSize: 'large', fontWeight: 'bold' }}>Order Confirmation</Typography>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={8}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">DHM Available</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.labor_stage ? data.labor_stage : 1}
                                                    label="DHM Available"
                                                    onChange={handleChange}
                                                    size="small"
                                                >
                                                    <MenuItem value={"Yes"}>Yes</MenuItem>
                                                    <MenuItem value={"No"}>No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Amount of Total DHM Available"
                                                placeholder="Amount of Total DHM Available"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Order Accepted</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={data.labor_stage ? data.labor_stage : 1}
                                                    label="Order Accepted"
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

                                {/* Update Recepient Register  */}
                                <TabPanel value="4">
                                    <Typography variant='p'  sx={{ fontSize: 'large', fontWeight: 'bold' }}>Update Recepient Register</Typography>
                                    <Divider/>
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Recepient Name"
                                                placeholder="Recepient Name"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Reason for receiving DHM"
                                                placeholder="Reason for receiving DHM"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={12} lg={8}>
                                            <TimePicker
                                                label="Time of DHM Order"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField size='small' {...params} />}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Donor ID"
                                                placeholder="Donor ID"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Batch Number"
                                                placeholder="Batch Number"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Volume of DHM Ordered (m/s)"
                                                placeholder="Volume of DHM Ordered (m/s)"
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

                                {/* DHM Receival  */}
                                <TabPanel value="5">
                                    <Typography variant='p'  sx={{ fontSize: 'large', fontWeight: 'bold' }}>DHM Receival</Typography>
                                    <Divider/>
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Dispatch Date"
                                            inputFormat="MM/dd/yyyy"
                                            value={value}
                                            onChange={handleChange}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Dispatch Date"
                                                inputFormat="MM/dd/yyyy"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Donor ID"
                                                placeholder="Donor ID"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Number of bottles"
                                                placeholder="Number of bottles"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Volume Dispenced (m/s)"
                                                placeholder="Volume Dispenced (m/s)"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Expiry Date"
                                                placeholder="Expiry Date"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Dispensing Staff Name"
                                                placeholder="Dispensing Staff Name"
                                                size="small"
                                            // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                label="Receiving staff name"
                                                placeholder="Receiving staff name"
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

                            </TabContext>
                        </Box>



                    </Container>
                </Layout>
            </LocalizationProvider>


        </>
    )

}




