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
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'


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

                            {/* 1. Mother Registration  */}
                            <TabPanel value="1">
                                {/* <p></p> */}
                                <Typography variant='p' display={'none'} sx={{ fontSize: 'large', fontWeight: 'bold' }}>Mother Medical Condition</Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={4}
                                            label="Mother's Medical Condition"
                                            placeholder="Mother's Medical Condition"
                                            size="small"
                                        // onChange={e => { setLoginInfo({ ...loginInfo, id_number: e.target.value }) }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">HIV Status</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.hiv_status}
                                                label="HIV Status"
                                                size="small"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={"Negative"}>Negative</MenuItem>
                                                <MenuItem value={"Positive"}>Positive</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={8}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Has mother shown any signs of antenatal Corticosteroids</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.hiv_status}
                                                label="Has mother shown any signs of antenatal Corticosteroids"
                                                size="small"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={"Negative"}>Negative</MenuItem>
                                                <MenuItem value={"Positive"}>Positive</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Baby's Medical Condition</Typography>
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

                            {/* Newborn Admission  */}
                            <TabPanel value="2">Item Two</TabPanel>


                            {/* Feeding Needs Assessment  */}
                            <TabPanel value="3">Item Three</TabPanel>

                            {/* Prescribe Feeds  */}
                            <TabPanel value="4">Item Three</TabPanel>

                            {/* Recording Feeding Data */}
                            <TabPanel value="5">Item Three</TabPanel>

                            {/* Health Information Monitoring  */}
                            <TabPanel value="6">Item Three</TabPanel>


                        </TabContext>
                    </Box>



                </Container>
            </Layout>



        </>
    )

}




