import {
    Card, CardContent, Button,
    CardMedia, Avatar, Grid, Typography, Stack
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function CurrentPatient({ data }) {

    let navigate = useNavigate()

    return (
        <>
            <Card sx={{ backgroundColor: "white", color: "purple" }}>
                <CardContent>
                    <Grid container>
                        <Grid item xl={3} lg={3} sm={3} md={3}>
                            <Typography variant="p">Patient Names: <b>{data.name}</b></Typography>
                        </Grid>
                        <Grid item xl={3} lg={3} sm={3} md={3}>
                            <Typography>Age: {data.age + " "}</Typography>
                        </Grid>
                        <Grid item xl={3} lg={3} sm={3} md={3}>
                            <Button variant="contained" onClick={e => { navigate(`/patients/${data.id}`) }}>Profile</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}




