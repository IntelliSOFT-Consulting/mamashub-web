import { Card, CardContent, CardHeader, Container, TextField, Button, Grid, Typography, Snackbar } from '@mui/material'
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { eraseCookie } from '../lib/cookie'



export default function Logout(){

    let navigate = useNavigate()
    

    useEffect(()=> {
        eraseCookie("token")
        navigate('/login')
    })
    
    return(
        <>
            <Container>
                <Typography variant="h2">
                    Logging you out.
                </Typography>
            </Container>
        </>
    )

}




