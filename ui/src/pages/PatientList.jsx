import { Stack, TextField, Button, Container, useMediaQuery, Snackbar, Alert, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from '../lib/cookie';
import { FhirApi } from './../lib/api'
import { startVisit } from '../lib/startVisit';


export default function PatientList() {
    let [patients, setPatients] = useState([])
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let [loading, setLoading] = useState(false)
    let [selected, setSelected] = useState([])
    let [name, setName] = useState('')

    let startPatientVisit = async () => {
        if (selected.length === 1) {
            startVisit(selected[0])
        }
        return
    }

    let viewPatient = async () => {
        if (selected.length === 1) {
            navigate(`/patients/${selected[0]}`)
        }
        return
    }

    let deletePatients = async () => {
        if (selected.length > 0) {
            for (let i of selected) {
                let data = await FhirApi({ url: `/fhir/Patient/${i}?_cascade=delete`, method: 'DELETE' })
                console.log(data)
            }
        }
        getPatients()
    }

    let search = async (name) => {
        try {
            setLoading(true)
            let data = await FhirApi({ url: `/fhir/Patient?name=${name}`, method: 'GET' })
            let p = data.data.entry.map((i) => {
                let r = i.resource
                console.log(r.name)
                return {
                    id: r.id, lastName: r.name[0].family,
                    age: `${(Math.floor((new Date() - new Date(r.birthDate).getTime()) / 3.15576e+10))} years`
                }
            })
            setPatients(p)
            setLoading(false)
            return
        } catch (error) {
            setMessage(`Could not find the patient ${name}`)
            setOpen(true)
            setLoading(false)
            setPatients([])
            setTimeout(() => {
                setOpen(false)
            }, 1500)
            return
        }
    }

    let getPatients = async () => {
        setLoading(true)
        let data = await FhirApi({ url: '/fhir/Patient?_count=100', method: 'GET' })
        let p = data.data.entry.map((i) => {
            let r = i.resource
            console.log(r.name)
            return {
                id: r.id, lastName: r.name[0].family,
                age: `${(Math.floor((new Date() - new Date(r.birthDate).getTime()) / 3.15576e+10))} years`
            }
        })
        setPatients(p)
        setLoading(false)
        return
    }

    useEffect(() => {
        getPatients()
    }, [])

    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/patients")
            return
        }
    }, [])
    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'id', headerName: 'Patient ID', width: 150, editable: true },
        { field: 'lastName', headerName: 'Last Name', width: 250, editable: true },
        { field: 'firstName', headerName: 'First Name', width: 250, editable: true },
        { field: 'age', headerName: 'Age', width: 150 },
    ];

    let isMobile = useMediaQuery('(max-width:600px)');


    let args = qs.parse(window.location.search);

    return (
        <>
            <Layout>
                <br />
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    onClose={""}
                    message={message}
                    key={"loginAlert"}
                />
                <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile ? "1em" : "2em", paddingRight: isMobile ? "1em" : "2em" }}>
                    <TextField type={"text"} size="small" sx={{ width: "80%" }} placeholder='Patient Name' onChange={e => { setName(e.target.value) }} />
                    <Button variant="contained" size='small' sx={{ width: "20%", backgroundColor: "#632165" }} onClick={e => { search(name) }} disableElevation>Search</Button>
                </Stack>
                <br />
                <Stack direction="row" spacing={2} alignContent="right" >
                    {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 0) ? '30%' : '70%' }}></Typography>}
                    {(selected.length > 0) &&
                        <>
                            <Button variant="contained" onClick={e => { deletePatients() }} disableElevation sx={{ backgroundColor: "#632165" }}> 🗑️Delete Patient{(selected.length > 1) && `s`}</Button>                        </>
                    }
                    {(selected.length === 1) &&
                        <>
                            <Button variant="contained" onClick={e => { startPatientVisit() }} disableElevation sx={{ backgroundColor: "#632165" }}>Start Visit</Button>
                            <Button variant="contained" onClick={e => { viewPatient() }} disableElevation sx={{ backgroundColor: "#632165" }}>View Patient</Button>
                        </>
                    }
                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }} onClick={e => { navigate('/patient-registration') }}>New Patient Registration</Button>
                </Stack>
                <br />
                <Container maxWidth="lg">
                    {(selectionModel.length < 1) && <Alert severity="error">Select a patient from the list to view or delete.</Alert>}
                    <DataGrid
                        loading={loading}
                        rows={patients ? patients : []}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                        autoHeight
                        disableSelectionOnClick
                        onSelectionModelChange={e => { setSelected(e) }}
                        onCellEditStop={e => { console.log(e) }}
                    />
                </Container>
            </Layout>
        </>
    )

}



