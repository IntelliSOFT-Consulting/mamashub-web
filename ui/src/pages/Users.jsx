import { useState, useEffect } from 'react'
import {
    Grid, Container, Typography, Card, Divider,
    CardContent, Alert, useMediaQuery
} from '@mui/material'
import Header from '../components/Header'
import HeaderDrawer from '../components/HeaderDrawer'
import { getCookie } from './../lib/cookie'
import { useNavigate } from 'react-router'
// import { GiReceiveMoney, GiPayMoney, GiCash, GiChecklist } from 'react-icons/gi'
// import { FaCashRegister } from 'react-icons/fa'
// import { MdOutlineAccountBox } from 'react-icons/md'


export default function Users() {

    let [users, setUsers] = useState(null)
    let isMobile = useMediaQuery('(max-width:600px)');
    let navigate = useNavigate()

    let getUsers = async () => {
        let data = (await (await fetch(`/users`,
            { method: "GET", headers: { "Content-Type": "application/json",  "Authorization":`Bearer ${getCookie("token")}` } })).json())
        setUsers(data.users)
        return
    }

    useEffect(() => {
        if (getCookie("token")) {
            getUsers()
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/users")
            return
        }
    }, [])


    return (
        <>
            {isMobile? 
                <Header />
                : <HeaderDrawer /> }

                <Container sx={{padding:'2em'}}>
                    <Card sx={{ backgroundColor: "#115987", color: "black", opacity: ".75" }}>
                        <CardContent> <br />
                            <Divider sx={{ backgroundColor: "white" }}></Divider>
        <Typography variant="h5" textAlign="center">Hahah</Typography>

                            <br />
                        </CardContent>
                    </Card>
        <br />
        <br />
        
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
                <Card sx={{ backgroundColor: "wheat", color: "#115987", borderRadius: "10px" }}>
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


