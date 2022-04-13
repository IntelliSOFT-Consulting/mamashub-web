import { Divider, Container, TextField, Button, Stack, Typography, Snackbar, Paper, useMediaQuery, Box } from '@mui/material'
import {useState,} from 'react'
import {useNavigate} from 'react-router-dom'
import { setCookie } from '../lib/cookie'

export default function Login(){

    let [loginInfo, setLoginInfo] = useState({})
    let navigate = useNavigate()
    let isMobile = useMediaQuery('(max-width:600px)');
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
        let data = (await (await fetch(`/auth/login`, 
            {   method:'POST', 
                headers:{"Content-Type":"application/json", },
                body: JSON.stringify(loginInfo)
            }
            )).json())
        console.log(data)
        if(data.status === "error"){    
                setMessage(data.message)
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
            
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
                open={open}
                onClose={""}
                message={message}
                key={"loginAlert"}
            />
            <Stack direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            >
            {/* Left Grid  */}
           
            <Box sx={{alignContent:'center', justifyContent:'center', alignItems:'center',width:'50%', minWidth:"50%", maxWidth:'50%'}}>
            <Paper sx={{backgroundColor:"#115987", color:'white', minWidth:'100%'}}>
            <br/>
            <br/>
            <Typography variant="h5" sx={{textAlign:"center", fontWeight:'bold'}}>Welcome to the Human Milk Bank</Typography>     
            <br/>
            <br/>           
            </Paper>

            <br/>
            <br/>   
            <br/>   
            <br/>
            <Typography variant="h3" sx={{textAlign:"center", fontWeight:'bold'}}>Login</Typography>
            <br/>
           <Container sx={{padding:'3.5em', alignContent:'center', justifyContent:'center', alignItems:'center', textAlign:'center'}}>
           <TextField
                    sx={{minWidth:"60%"}}
                    type="email"
                    label="Email Address"
                    placeholder="Email Address"
                    size="small"
                    onChange={e=>{setLoginInfo({...loginInfo, id_number:e.target.value})}}

                    />
                    <br/><br/>
                    <TextField
                    type="password"
                    label="Password"
                    placeholder="Password"
                    sx={{minWidth:"60%"}}
                    size="small"
                    onChange={e=>{setLoginInfo({...loginInfo, password:e.target.value})}}
                    />
                    <br/>
                    <br/>
                    <br/>
                    <Button variant="contained"
                     disableElevation onClick={e=>{login()}}
                    sx={{width:"50%", backgroundColor:"#115987", borderRadius:"10px"}}>Login</Button>
                
            <br/>
            <br/>
            <Typography sx={{textDecoration:"underline"}}
                textAlign="center"
            ><a href="/reset-password">Forgot Password? Reset.</a></Typography>
            <br/>


           </Container>
                    
            {/* <Divider orientation='vertical'  sx={{color:"black"}}/> */}
            <br/>
            <br/>
            <br/>
            <br/> <br/>
            <br/>
            <br/>
            <br/>
        
            </Box>

            

            {/* Right Grid  */}
           <Box sx={{padding:'3em'}}>
                <br/>
                <br/>
                <br/>
                {(!isMobile) && 
                <img src={'landing_page.svg'} style={{width:"650px"}}alt="landing_page_img"></img>
                }
           </Box>
            </Stack>
        </>
    )

}




