import { Card, CardContent, CardHeader, Container, TextField, Button, Grid, Typography, Snackbar } from '@mui/material'
import {useState,} from 'react'
import {useNavigate} from 'react-router-dom'
import { setCookie } from '../lib/cookie'

export default function Login(){

    let [loginInfo, setLoginInfo] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    let login = async () => {
        let requiredFields = ['email', 'password']
        for(let i; i < requiredFields.length; i++){
            if(!(requiredFields[i] in Object.keys(loginInfo))){
                console.log(`${requiredFields[i]} is missing`)
                return
            }
        }
        let data = (await (await fetch(`/api/method/fosa.api.auth.login`, 
            {   method:'POST', 
                headers:{"Content-Type":"application/json", },
                body: JSON.stringify(loginInfo)
            }
            )).json())
        console.log(data)
        if(data.status === "error"){
                setMessage(data.error)
                setOpen(true)
                return
        }
        else{
            setCookie("token", data.token, 24)
            if (window.localStorage.getItem("next_page")){
                navigate(window.localStorage.getItem("next_page"))
                window.localStorage.removeItem("next_page")
                return
            }
            navigate('/')
            return
        }
            
    }
    return(
        <>
            <Container>
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
                open={open}
                onClose={""}
                message={message}
                key={"loginAlert"}
            />
            <Grid
                container
                justifyContent="center"
                alignItems="center"
            >
            <Grid item xs={12} lg={6} md={12} sx={{paddingTop:"10%"}}>
            <Typography variant="h5" sx={{textAlign:"center"}}>Lonius Practice Manager</Typography>
            <br/>
            <Card sx={{maxWidth:"500px",backgroundColor:"", border:"1px black solid"}}>
                <CardHeader title="Login" sx={{color:"green"}}></CardHeader>
                <CardContent>
                    <TextField
                    sx={{minWidth:"100%"}}
                    type="email"
                    placeholder="Email Address"
                    size="small"
                    onChange={e=>{setLoginInfo({...loginInfo, id_number:e.target.value})}}

                    />
                    <br/><br/>
                    <TextField
                    type="password"
                    placeholder="Password"
                    sx={{minWidth:"100%"}}
                    size="small"
                    onChange={e=>{setLoginInfo({...loginInfo, password:e.target.value})}}
                    />
                    <br/>
                    <br/>
                    <Button variant="contained"
                     disableElevation onClick={e=>{login()}}
                    sx={{width:"50%", marginLeft:"25%", backgroundColor:"green"}}
                    >Login</Button>
                </CardContent>
            </Card>
            <br/>
            <Typography sx={{textDecoration:"underline"}}
                textAlign="center"
            ><a href="/reset-password">Forgot Password? Reset.</a></Typography>
            <br/>
            <Typography sx={{textDecoration:"underline"}}
                textAlign="center"
            > <a href="/register">Don't have an account? Sign Up.</a></Typography>
            </Grid>
            </Grid>
            </Container>
        </>
    )

}




