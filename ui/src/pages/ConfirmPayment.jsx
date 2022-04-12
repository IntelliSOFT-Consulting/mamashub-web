import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
    Container, CircularProgress, Box, Typography, Alert, AlertTitle
} from '@mui/material'


export default function ConfirmPayment() {

    let { id } = useParams()
    let navigate = useNavigate()

    let [paymentStatus, setPaymentStatus] = useState(false)
    let [counter, setCounter] = useState(0)

    let confirmPayment = async () => {
        let data = (await (await fetch(`/api/method/fosa.api.payments.confirm_payment`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    payment: id
                })
            }
        )).json())
        console.log(data)
        setCounter(counter + 1)
        if (data.status === "success") {
            navigate('/reservations')
            console.log(data)
            return
        }
        return
    }

    useEffect(() => {
        // getListing()
        confirmPayment()
    }, [counter])


    return (<>

        <Header />
        <Container maxWidth="lg">
            {!(paymentStatus) && <Box sx={{ mx: "auto", width: 400 }}>
                <CircularProgress sx={{ mx: "auto" }} />
                <Typography variant="h4">Confirming Payment</Typography>
                <br/>
                <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                    Enter your PIN on the pop-up that appears on your screen to authorize payment.
                </Alert>
            </Box>}

        </Container>

    </>)


}




