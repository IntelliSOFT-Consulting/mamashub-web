import { PregnantWoman } from '@mui/icons-material'
import {
    Card, CardContent, Button,
    CardMedia, Avatar, Grid, Typography, Stack, Snackbar,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { MedicalInformation, Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export default function CurrentPatient({ data }) {

    let navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState(false)

    let endVisit = () => {
        window.localStorage.removeItem("currentPatient")
        navigate("/patients")
        return
    }

    useEffect(() => {
        if (!window.localStorage.getItem("currentPatient")) {
            setMessage("")

        }
    }, [window.localStorage.getItem("currentPatient")])

    return (
        <>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={e => { console.log(e) }}
                message={message}
                key={"loginAlert"}
            />

            <Card sx={{ backgroundColor: "white", color: "purple", border: "1px black solid" }}>
                <CardContent>
                    <Grid container>
                        <Grid item xl={1} lg={1} sm={3} md={3}>
                            <Avatar >
                                <PregnantWoman sx={{ color: "purple", backgroundColor: "yellow" }} />
                            </Avatar>
                        </Grid>
                        <Grid item xl={6.8} lg={6.8} sm={3} md={3}>
                            <Typography variant="p">Patient Names: <b>{data.name}</b></Typography><br />
                            <Typography>Age: {data.age + " "}</Typography>
                        </Grid>
                        <Grid item xl={4.2} lg={4.2} sm={3} md={3}>
                            <Button variant="contained" sx={{ backgroundColor: "#632165", float: "left" }} startIcon={<MedicalInformation />} onClick={e => { navigate(`/patients/${data.id}`) }}>View Profile</Button>
                            <Button variant="contained" sx={{ backgroundColor: "#632165", float: "right" }} startIcon={<Close />} onClick={e => { endVisit() }}>Close Visit</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <p></p>
        </>
    )
}




