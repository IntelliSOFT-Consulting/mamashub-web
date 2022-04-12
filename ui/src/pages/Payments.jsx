import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Container, Grid, Typography, LinearProgress, Card, CardContent, Divider, CardActions, Button } from '@mui/material'
import { getCookie } from '../lib/cookie'
import { useNavigate } from 'react-router'


export default function Payment() {

    let [payments, setPayments] = useState(null)
    let navigate = useNavigate()
    let getPayments = async () => {

        let data = (await (await fetch("/api/method/fosa.api.account.payments",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "token": getCookie("token") })
            })).json())
        console.log(data)
        setPayments(data.payments)
    }

    useEffect(() => {

        if (getCookie("token")) {
            getPayments()
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/payments")
            return
        }

    }, [])

    return (<>
        <Header />
        <Container maxWidth="lg">
            <Typography variant="h5" sx={{textDecoration:"underline"}}>
                My Payments
            </Typography>
            <br /><br />
            {!payments ?
                <>
                    <br /><br /><br /><br />
                    <LinearProgress color="inherit" />
                    <Typography sx={{ textAlign: "center" }} variant="h5">Loading Payments</Typography>
                </> :
                (payments.length === 0) ? <>
                    <br />
                    <Typography sx={{ textAlign: "center" }} variant="h5">No Payments Found.</Typography>
                    <br />
                    <Typography sx={{ textAlign: "center" }} variant="h6">Start Saving today.</Typography>
                </> : <></>
            }
            <Grid container justifyContent="center"
                alignItems="center" spacing={2}>
                {payments && payments.map((item) => {
                    return <Grid item xs={12} lg={8}>
                        <PaymentItem data={item} />
                    </Grid>
                })}
            </Grid>
        </Container>
    </>)
}

let p = {


}

let PaymentItem = ({ data }) => {
    let navigate = useNavigate()
    return (
        <>
            <Card sx={{ border: "1px solid black", backgroundColor: "green" }} onClick={e => { navigate(`/saving/${data.name}`) }} elevation={0}>
                <CardContent>
                    <Typography variant="h5">KES {data.amount}</Typography>
                    <Typography>Status: {data.status}</Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>2 days ago.</Typography>
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

