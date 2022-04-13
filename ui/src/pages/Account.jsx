import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
    Container, useMediaQuery, Typography, LinearProgress,
    Divider,
} from '@mui/material'
import { getCookie } from '../lib/cookie'


export default function Account() {

    let { id } = useParams()
    let isMobile = useMediaQuery('(max-width:600px)');
    let navigate = useNavigate()
    let [profile, setProfile] = useState(null)
    let getProfile = async () => {
        let data = (await (await fetch("/api/method/fosa.api.account.profile",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "token": getCookie("token") })
            })).json())
        console.log(data)
        setProfile(data.profile)
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (<>

        <Header />
        <Container maxWidth="lg">
        <Typography variant="h5" sx={{textDecoration:"underline"}}>
                Account Details
            </Typography>
        <br />
            {
                profile ? <>
                    <Typography variant="h6">Name</Typography>
                    <Typography variant="h5">{profile.account.member_name}</Typography>
                    <br />
                    <Divider orientation="horizontal" />
                    <br />
                    <Typography variant="h6">Account No.</Typography>
                    <Typography variant="h5">{profile.account.account_number}</Typography>
                    <br />
                    <Divider orientation="horizontal" />
                    <br />
                    <Typography variant="h6">Phone No: {profile.member.phone}</Typography>
                    <Typography variant="h6">Email: {profile.member.email}</Typography>
                    <Typography variant="h6">ID No: {profile.member.id_number}</Typography>

                    <br />
                    <Divider orientation="horizontal" />
                    <br />


                    <br />
                    <Divider orientation="horizontal" />
                    <br />

                    <Typography variant="h5">Account Status</Typography>
                    <Typography variant="h6">Status: {profile.member.status}</Typography>
                    <Typography variant="h6">Verified: {profile.member.verified}</Typography>

                </> : <>
                    <br /><br /><br /><br />
                    <LinearProgress color="inherit" />
                    <Typography sx={{ textAlign: "center" }} variant="h5">Loading Account Info</Typography>
                </>}
            <br />
            <Divider orientation="horizontal" />
            <br />
        </Container>

    </>)
}




