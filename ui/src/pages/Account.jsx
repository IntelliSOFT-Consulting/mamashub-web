import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card, Typography, CircularProgress, Divider, Grid, CardContent,
} from '@mui/material'
import { getCookie } from '../lib/cookie'
import Layout from '../components/Layout'
import { apiHost } from '../lib/api'


export default function Account() {

    let navigate = useNavigate()
    let [profile, setProfile] = useState(null)
    let getProfile = async () => {
        let data = (await (await fetch(`${apiHost}/auth/me`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
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
            window.localStorage.setItem("next_page", "/account")
            return
        }
    }, [])

    return (<>
        <Layout>
            <Typography variant='h5'>Account Information</Typography>

            {profile ?
                <Grid container spacing={2} padding=".5em" >
                    <Grid item xs={12} md={12} lg={6}>
                        <Card>
                            <CardContent>
                                <Divider />
                                <Typography>User ID:</Typography>
                                <Typography variant='h5'>{profile.id}</Typography>
                                <Divider />
                                <Typography>Names:</Typography>
                                <Typography variant='h5'>{profile.names}</Typography>
                                <Divider />

                                <Typography>Email Address:</Typography>
                                <Typography variant='h5'>{profile.email}</Typography>
                                <Divider />

                                <Typography>Role:</Typography>
                                <Typography variant='h5'>{profile.role}</Typography>
                                <Divider />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <Card>
                            <CardContent>
                                <Typography>Facility / Community Health Unit:</Typography>
                                <Typography variant='h5'>{profile.facilityName || ""}</Typography>
                                <Divider />

                                <Typography>Facility Code:</Typography>
                                <Typography variant='h5'>{profile.kmhflCode || ""}</Typography>
                                <Divider />

                                <Typography>Created At:</Typography>
                                <Typography variant='h5'>{new Date(profile.createdAt).toLocaleString()}</Typography>
                                <Divider />

                                <Typography>Last Updated At:</Typography>
                                <Typography variant='h5'>{new Date(profile.updatedAt).toLocaleString()}</Typography>
                                <Divider />
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid> : <CircularProgress />}

        </Layout>

    </>)
}




