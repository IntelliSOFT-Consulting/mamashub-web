import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import { Container, Stack, useMediaQuery, Card, 
        Paper, Grid, Typography, LinearProgress, 
        Divider
} from '@mui/material'
// import Card
import {getCookie} from '../lib/cookie'


export default function Saving() {

    let { id } = useParams()
    let isMobile = useMediaQuery('(max-width:600px)');
    let [saving, setSaving] = useState(null)


    let getSaving  = async () => {
        let data = (await (await fetch(`/api/method/fosa.api.account.savings.get_one?id=${id}&token=${getCookie("token")}`,)).json())
        console.log(data)
        setSaving(data.saving)
    }

    useEffect(() => {
        getSaving()
    }, [])



    return (<>

        <Header />
        <Container maxWidth="lg">

            {saving ? <>
                {/* {JSON.stringify(reservation)} */}
                <br/>
                <Stack direction={isMobile ? "column": "row"} spacing="8">
                    <Paper sx={{minWidth:"50%", padding:"2em"}} elevation={0} >
                        <Container>
                            <Typography variant="h3">{JSON.stringify(saving)}</Typography>
                        </Container>
                        <br/>
                        <Divider orientation="horizontal"/>

                    </Paper>
                </Stack>

            </> : <>
            <br/><br/><br/><br/>
             <LinearProgress color="inherit" />
             <Typography sx={{textAlign:"center"}} variant="h5">Loading Saving Details</Typography>
            </>}
            {/* <br/>
            <Divider orientation="horizontal"/>
            <br /> */}
        </Container>

    </>)


}




