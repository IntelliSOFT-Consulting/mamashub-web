import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { Container, useMediaQuery, Card,  LinearProgress, 
        Divider, Grid, Typography
} from '@mui/material'
import { getCookie } from '../lib/cookie';


export default function Statement() {
    let isMobile = useMediaQuery('(max-width:600px)');

    let [statement, setStatement] = useState(null)
    let getStatement = async () => {
        let data = (await (await fetch(`/api/method/fosa.api.account.statement?token=${getCookie('token')}`)).json())
        console.log(data)
        setStatement(data.statement)
    }

    useEffect(() => {
        getStatement()
    }, [])



    return (<>

        <Header />
        <Container maxWidth="lg">
        <Typography variant="h5"  sx={{textDecoration:"underline"}}>
                My Statement
            </Typography>
            <br/>
            {statement ? <>
                {/* {JSON.stringify(listing)} */}
                <br/>
                <Grid container spacing={2}>
            {(statement.status === "success") && statement.map((item) => {
                return <Grid item xs={12} lg={4}>
                <StatementItem data={item} type={item.type}/>
            </Grid>
            })}
        </Grid>
            </> : <>
            <br/><br/><br/><br/>
             <LinearProgress color="inherit" />
             <Typography sx={{textAlign:"center"}} variant="h5">Loading Statement</Typography>
            </>}
            <br/>
            <Divider orientation="horizontal"/>
            <br />
        </Container>

    </>)

}

let StatementItem = ({data, type}) => {

    let navigate = useNavigate()


    return (
        <>
        <Card sx={{minWidth:"30%", padding:"2em", border:"1px solid black"}} elevation={0}>
            
        </Card>
        </>
    )
}



