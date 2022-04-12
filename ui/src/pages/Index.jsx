import { useState, useEffect } from 'react'
import {
    Grid, Container, Typography, Card, Divider,
    CardContent, Alert
} from '@mui/material'
import Header from '../components/Header'
import { getCookie } from './../lib/cookie'
import { useNavigate } from 'react-router'
import { GiReceiveMoney, GiPayMoney, GiCash, GiChecklist } from 'react-icons/gi'
import { FaCashRegister } from 'react-icons/fa'
import { MdOutlineAccountBox } from 'react-icons/md'


export default function Index() {

    let [memberInfo, setMemberInfo] = useState(null)

    let navigate = useNavigate()

    let getMemberInfo = async () => {
        let data = (await (await fetch(`/api/method/fosa.api.auth.me?token=${getCookie("token")}`,
            { method: "GET", headers: { "Content-Type": "application/json" } })).json())
        setMemberInfo(data.member)
        return
    }

    useEffect(() => {
        if (getCookie("token")) {
            getMemberInfo()
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/")
            return
        }
    }, [])


    return (
        <>
            <Header />
            <Container maxWidth="lg">
                <Card sx={{ backgroundColor: "green", color: "white", opacity: ".75" }}>
                    <CardContent> <br />
                        <Typography variant="h5">Welcome {memberInfo ? String(memberInfo.first_name) : "USER"}</Typography>
                        <Divider sx={{ backgroundColor: "white" }}></Divider>
                        <br />
                    </CardContent>
                </Card>
                <br />
                <Typography variant="h5" textAlign="center">My Services</Typography>
                <br />
                <Grid container>
                    <Icon title="Savings" url="/savings" icon={<GiCash />} />
                    <Icon title="Request Loan" url="/request-loan" icon={<GiReceiveMoney />} />
                    <Icon title="Repay Loan" url="/loan-repayment" icon={<GiPayMoney />} />
                    <Icon title="My Statement" url="/statement" icon={<GiChecklist />} />
                    <Icon title="Payments" url="/payments" icon={<FaCashRegister />} />
                    <Icon title="My Account" url="/my-account" icon={<MdOutlineAccountBox />} />
                </Grid>
                <br />
            </Container>
        </>
    )
}


let Icon = ({ title, url, icon = null }) => {

    let navigate = useNavigate()

    return (
        <>
            <Grid item xs={6} lg={4} md={6} sx={{ padding: ".4em", textAlign: "center", alignItems: "center", }} onClick={e => { navigate(url) }}>
                <Card sx={{ backgroundColor: "wheat", color: "green", borderRadius: "10px" }}>
                    <CardContent>
                        <Typography sx={{ textAlign: "center", fontSize: "40px" }} >{icon ? icon : ''}</Typography>
                    </CardContent>
                </Card>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                    {title}
                </Typography>
            </Grid>
        </>
    )
}


