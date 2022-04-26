import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
    Container, Typography, LinearProgress,
    Divider,
} from '@mui/material'
import { getCookie } from '../lib/cookie'
import Layout from '../components/Layout'


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
       <Layout>
        <Typography>Account Information</Typography>

       </Layout>

    </>)
}




