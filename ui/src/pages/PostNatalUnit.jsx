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


export default function PostNatalUnit({ id }) {

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
                                    <Tab label="Milk Expression & Storage" value="1" />
                                    <Tab label="Lactation Support" value="2" />
                                    <Tab label="Baby's Feeding Effectiveness" value="3" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                {/* <p></p> */}
                                <Typography variant='p' display={'none'} sx={{ fontSize: 'large', fontWeight: 'bold' }}>Biodata</Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="First Name"
                                            placeholder="First Name"
                                            size="small"
                                            value={patient.firstName}
                                            onChange={e=>{setPatient({...patient, firstName:e.target.value})}}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Last Name"
                                            placeholder="Last Name"
                                            size="small"
                                            value={patient.lastName}
                                            onChange={e=>{setPatient({...patient, lastName:e.target.value})}}
                                        // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Date of Birth"
                                            placeholder="Date of Birth"
                                            size="small"
                                        // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                        />
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
                            <TabPanel value="2">Item Two</TabPanel>
                            <TabPanel value="3">Item Three</TabPanel>
                        </TabContext>
                    </Box>



                </Container>
            </Layout>



        </>
    )

}




