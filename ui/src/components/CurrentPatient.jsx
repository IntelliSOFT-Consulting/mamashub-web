import { PregnantWoman } from '@mui/icons-material'
import {
    Card, CardContent, Button,
    CardMedia, Avatar, Grid, Typography, Stack
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function CurrentPatient({ data }) {

    let navigate = useNavigate()

    return (
        <>
            <Card sx={{ backgroundColor: "white", color: "purple", border: "1px black solid" }}>
                <CardContent>
                    <Grid container>
                        <Grid item xl={3} lg={1} sm={3} md={3}>
                            <Avatar >
                                <PregnantWoman sx={{color:"purple",backgroundColor:"yellow"}}/>
                            </Avatar>
                        </Grid>
                        <Grid item xl={3} lg={9} sm={3} md={3}>
                            <Typography variant="p">Patient Names: <b>{data.name}</b></Typography><br />
                            <Typography>Age: {data.age + " "}</Typography>
                        </Grid>
                        <Grid item xl={3} lg={2} sm={3} md={3}>
                            <Button variant="contained" sx={{ backgroundColor: "#632165" }} onClick={e => { navigate(`/patients/${data.id}`) }}>View Profile</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <p></p>
        </>
    )
}




