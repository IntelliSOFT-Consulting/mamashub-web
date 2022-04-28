import { useState, useEffect } from 'react'
import {
    Grid, CardMedia, Typography, Card, Stack,
    CardContent, Alert,
} from '@mui/material'
import Header from '../components/Header'
import HeaderDrawer from '../components/HeaderDrawer'
import { getCookie } from './../lib/cookie'
import { useNavigate } from 'react-router'
import Layout from '../components/Layout'
// import PostNatal from './../icons/PostNatal.svg'
// import { GiReceiveMoney, GiPayMoney, GiCash, GiChecklist } from 'react-icons/gi'
// import { FaCashRegister } from 'react-icons/fa'
// import { MdOutlineAccountBox } from 'react-icons/md'


export default function Index() {

    let [user, setUser] = useState(null)
    let navigate = useNavigate()

    let getUser = async () => {
        let response = (await (await fetch(`/auth/me`,
            { method: "GET", headers: { "Content-Type": "application/json",  "Authorization":`Bearer ${getCookie("token")}` } })).json())
        setUser(response.data)
        return
    }

    useEffect(() => {
        if (getCookie("token")) {
            getUser()
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/")
            return
        }
    }, [])


    return (
        <>
            <Layout>
            <br />
            <Grid container>
            <Icon title={"Newborn"} url={'/new-born-unit'} />
            <Icon title={"Post Natal"} url={'/post-natal-unit'} />
            <Icon title={"Patients List"} url={'/patients'} />
            <Icon title={"Monitoring & Assessment"} url={'/patients-list'} />
            <Icon title={"Maternity Unit"} url={'/maternity-unit'} />
            <Icon title={"Human Milk Bank"} url={'/patients-list'} />

            </Grid>
            <br />
            </Layout>
           
        </>
    )
}




let Icon = ({ title, url, icon }) => {

    let navigate = useNavigate()

    return (
        <>
            <Grid item xs={6} lg={4} md={6} sx={{ padding: ".4em", textAlign: "center", alignItems: "center", }} onClick={e => { navigate(url) }}>
                <Stack sx={{ backgroundColor: "#115987", color: "white", borderRadius: "3px", maxHeight:"300px" }}>
                {/* <CardMedia
        component="img"
        height="40px"
        image="/icons/PostNatal.svg"
        alt="green iguana"
      /> */}
                   
                        <img src="/icons/PostNatal.svg" style={{height:'100px'}} alt="e"/>
                   
                    <Typography variant="p" sx={{ textAlign: "center" }}>
                    {title}
                    </Typography>
                    <br/>
                    <br/>
                </Stack>
                
            </Grid>
        </>
    )
}


