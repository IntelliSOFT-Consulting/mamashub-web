import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
    Container, useMediaQuery, Card, LinearProgress,
    Divider, Grid, Typography, CardContent, Button, CardActions
} from '@mui/material'
import { getCookie } from '../lib/cookie';


export default function Savings() {
    let isMobile = useMediaQuery('(max-width:600px)');

    let [savings, setSavings] = useState([d,d,d,d,d,d])
    let getSavings = async () => {
        let data = (await (await fetch(`/api/method/fosa.api.account.savings?token=${getCookie('token')}`)).json())
        console.log(data)
        setSavings(data.savings)
    }

    useEffect(() => {
        // getSavings()
    }, [])



    return (<>

        <Header />
        <Container maxWidth="lg">
            {savings ? <>
                {/* {JSON.stringify(listing)} */}
                <Typography variant="h5" sx={{textDecoration:"underline"}}>My Savings</Typography>
                <br />
                <Grid container spacing={2}>
                    {(savings.length > 0) && savings.map((item) => {
                        return <Grid item xs={6} lg={4}>
                            <SavingItem data={item} />
                        </Grid>
                    })}
                </Grid>
            </> : <>
                <br /><br /><br /><br />
                <LinearProgress color="inherit" />
                <Typography sx={{ textAlign: "center" }} variant="h5">Loading Savings</Typography>
            </>}
            <br />
            <Divider orientation="horizontal" />
            <br />
        </Container>

    </>)


}


let d = {
    "member": "Me",
    "amount": "34.66",
    "type": "",
    "account": "Test",
    "status": "Approved",
    "tx_reference": "MN73F6TH8",
    "notes": "Some other notes over here.",
    "name": "e4r4r5t6y"
}
let SavingItem = ({ data }) => {
    let navigate = useNavigate()
    return (
        <>
                <Card sx={{ border: "1px solid black", backgroundColor: "green" }} onClick={e => { navigate(`/saving/${data.name}`) }} elevation={0}>
                    <CardContent>
                        <Typography variant="h5">KES {data.amount}</Typography>
                        <Typography>Status: {data.status}</Typography>
                        <Typography sx={{fontSize:"12px", fontWeight:"bold"}}>2 days ago.</Typography>
                        <Divider orientation="horizontal" />
                        <br />
                        <Typography>Notes:{data.notes}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" sx={{ color: "white" }} size="small" color="primary">
                            More Info
                        </Button>
                    </CardActions>
                </Card>
        </>
    )
}



