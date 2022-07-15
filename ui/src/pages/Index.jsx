import { Typography, Stack, TextField, Grid, Container, useMediaQuery, Card, CardContent } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';

import { FhirApi } from './../lib/api'

export default function Index() {
    let [patients, setPatients] = useState()
    let navigate = useNavigate()
    let [selected, setSelected] = useState([])



    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    // console.log(args)

    return (
        <>
            <Layout>
                <br />
                <Container maxWidth="lg">
                <Typography variant="h5">Welcome</Typography>
                    <Grid container spacing={1} padding=".5em" >
                        <Grid item xs={12} md={12} lg={3} >
                            <StatCard title="Admins" number="34" bg="#D0ADFC" />
                        </Grid>
                        <Grid item xs={12} md={12} lg={3}>
                            <StatCard title="Clinicans" number="34" bg="#D0ADFC" />
                        </Grid>
                        <Grid item xs={12} md={12} lg={3}>
                            <StatCard title="CHW" number="34" bg="#D0ADFC" />
                        </Grid>
                        <Grid item xs={12} md={12} lg={3}>
                            <StatCard title="Total Registered" number="34" bg="#D0ADFC" />
                        </Grid>
                    </Grid>
                </Container>
            </Layout>
        </>
    )

}


let StatCard = ({ number, title, bg }) => {

    return <>
        <Card sx={{ backgroundColor: bg }}>
            <CardContent>
                <Typography variant="h4">{number}</Typography>
                <Typography variant="h6">{title}</Typography>
            </CardContent>
        </Card>
    </>
}




