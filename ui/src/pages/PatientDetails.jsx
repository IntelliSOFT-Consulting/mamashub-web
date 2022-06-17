import { Card, CardContent, CardHeader, Container, Typography, Button, Grid, Snackbar, Divider } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCookie } from '../lib/cookie'
import { FhirApi } from '../lib/api'
import Layout from '../components/Layout'
import { timeSince } from '../lib/timeSince'

export default function PatientDetails() {

    let [patient, setPatient] = useState()
    let { id } = useParams();
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    useEffect(() => {
        getPatientDetails(id)
    }, [])

    let getPatientDetails = async (id) => {
        setOpen(false)
        let data = await FhirApi({
            url: `/fhir/Patient/${id}`, method: 'GET',
        })
        console.log(data)
        setOpen(false)
        if (data.status === "error") {
            setMessage(data.error)
            setOpen(true)
            return
        }
        else {
            setPatient(data.data)
            return
        }
    }

    return (
        <>
            <Layout>
                <Container>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={open}
                        onClose={""}
                        message={message}
                        key={"loginAlert"}
                    />
                    <Button variant="outlined" onClick={e => { navigate('/patients') }} sx={{ width: "30%", marginLeft: "25%", color: "#632165" }}
                    >BACK TO PATIENTS LIST</Button>
                    <br />
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={12} lg={10} md={12} sx={{ paddingTop: "2%" }}>

                            <Card sx={{ backgroundColor: "", border: "1px black solid" }}>
                                <CardHeader title={`Patient Card`} sx={{ color: "#632165" }}></CardHeader>
                                <Divider></Divider>
                                <CardContent>
                                    {patient ? <>
                                        <Typography variant="h5">{patient.name[0].family || ''} {patient.name[0].given[0] || ''} </Typography>
                                        <Typography>Patient ID: {id}</Typography>
                                        <Typography>Age: {timeSince(new Date(patient.birthDate))}</Typography>
                                        <Typography>Phone: {patient.telecom[0].value || "Not Provided"}</Typography>
                                    </> : <Typography>Loading</Typography>}

                                </CardContent>
                            </Card>

                        </Grid>
                    </Grid>
                </Container>
            </Layout>
        </>
    )
}
