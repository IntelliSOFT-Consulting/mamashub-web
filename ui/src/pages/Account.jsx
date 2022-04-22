import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
    Container, Typography, LinearProgress,
    Divider,
} from '@mui/material'
import { getCookie } from '../lib/cookie'


export default function Account() {

    let navigate = useNavigate()
    let [profile, setProfile] = useState(null)
    let getProfile = async () => {
        let data = (await (await fetch("/auth/me",
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization":`Bearer ${getCookie("token")}` }
            })).json())
        console.log(data)
        setProfile(data.data)
    }

    useEffect(() => {
        if (getCookie("token")) {
            getProfile()
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/")
            return
        }
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
                    <Typography variant="h5">{profile.names}</Typography>
                    <br />
                    <Divider orientation="horizontal" />
                    <br />
                    <Typography variant="h6">User Id.</Typography>
                    <Typography variant="h5">{profile.id}</Typography>
                    <br />
                    <Divider orientation="horizontal" />
                    <br />
                    <Typography variant="h6">Username: {profile.username}</Typography>
                    <Typography variant="h6">Email: {profile.email}</Typography>
                    <Typography variant="h6">Created At: {profile.createdAt}</Typography>
                    <Typography variant="h6">Last Updated: {profile.createdAt}</Typography>

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




