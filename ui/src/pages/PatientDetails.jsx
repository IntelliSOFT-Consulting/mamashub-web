import { Card, CardContent, CardHeader, Container, TextField, Button, Grid, Snackbar } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {getCookie} from '../lib/cookie'
import {FhirApi} from '../lib/api'
import Layout from '../components/Layout'


export default function PatientDetails() {

    let [patient, setPatient] = useState({})
    let { id } = useParams();
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    let getPatientDetails = async ({id}) => {
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
            setPatient(data.patient)
            return
        }
    }

    useEffect(() => {
        getPatientDetails(id)
    },[])
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
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={12} lg={6} md={12} sx={{ paddingTop: "2%" }}>
                        <Card sx={{ maxWidth: "500px", backgroundColor: "", border: "1px black solid" }}>
                            <CardHeader title={`Patient/${id}`} sx={{ color: "#632165" }}></CardHeader>
                            <CardContent>
                                {patient && JSON.stringify(patient)}
                            </CardContent>
                        </Card>
                        <br />
                        <Button variant="outlined" onClick={e => { navigate('/patients') }} sx={{ width: "50%", marginLeft: "25%", color: "#632165" }}
                        >BACK TO PATIENTS LIST</Button>
                    </Grid>
                </Grid>
            </Container>
            </Layout>
        </>
    )

}




