import { Card, CardContent, CardHeader, Container, TextField, Button, Grid, Typography, Stack, LinearProgress, Snackbar, Modal, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCookie } from '../lib/cookie'


import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export default function RequestLoan() {
    let navigate = useNavigate()
    let [data, setData] = useState({ token: getCookie("token") })
    let [unpaid, setUnpaid] = useState(null)
    let [loanLimit, setLoanLimit] = useState(0)

    let getLoanLimit = async () => {
        let response = (await (await fetch(`/api/method/fosa.api.account.loan_limit`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ token: getCookie("token") })
            }
        )).json())
        console.log(response)
        setLoanLimit(response.loan_limit)
    }

    let getPendingLoans = async () => {

        let response = (await (await fetch(`/api/method/fosa.api.loans.get_many`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({...data, status: "Unpaid"})
            }
        )).json())
        setUnpaid(response.loans)
        console.log(response)

    }

    let makeRepayment = async () => {
        
    }

    useEffect(() => {
        getPendingLoans()
    }, [])


    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Header />
                <Container>
                <Typography variant="h5" sx={{textDecoration:"underline"}}>Make Loan Repayment</Typography>
                <br/>
                <Button variant="solid" sx={{ backgroundColor: "green",}} onClick={e => { navigate('/loan-repayments') }}>Back to My Repayments</Button>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={12} lg={6} md={12}>
                            <br />
                            <br />
                            <Card sx={{ maxWidth: "500px", backgroundColor: "", border: "1px black solid" }}>

                                <CardHeader sx={{ color: "green" }}></CardHeader>
                                <CardContent>
                                <TextField
                                        autoComplete="none"
                                        sx={{ minWidth: "100%" }}
                                        type="text"
                                        placeholder="Select Loan"
                                        size="small"
                                        disabled
                                        onChange={e => { setData({ ...data, purpose: e.target.value }) }}
                                    />
                                    <br /><br />

                                    <TextField
                                        autoComplete="none"
                                        sx={{ minWidth: "100%" }}
                                        type="number"
                                        min="0" step="any"
                                        placeholder="Loan Amount"
                                        size="small"
                                        onChange={e => { setData({ ...data, amount: e.target.value }) }}
                                    />
                                    <br />
                                    <br />
                                    <Button variant="contained"
                                        disableElevation onClick={e => { makeRepayment() }}
                                        sx={{ width: "50%", marginLeft: "25%", backgroundColor: "green" }}
                                    >Make Repayment</Button>
                                </CardContent>
                            </Card>
                        </Grid></Grid>
                </Container>
            </LocalizationProvider>
        </>
    )
}

