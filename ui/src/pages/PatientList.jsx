import { Paper, Stack, TextField, Button, Container, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from '../lib/cookie';

import { FhirApi } from './../lib/api'

export default function PatientList() {
    let [patients, setPatients] = useState()
    let navigate = useNavigate()

    let getPatients = async () => {

        let data = await FhirApi({ url: '/fhir/Patient', method: 'GET'})
        let p = data.data.entry.map((i) => {
            let r = i.resource
            return { id: r.id, lastName: r.name[0].family, firstName: r.name[0].given[0],
                age: `${(Math.floor((new Date() - new Date(r.birthDate).getTime()) / 3.15576e+10))} years`
            }
        })
        setPatients(p)
    }

    let deletePatient = async () => {

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
        { field: 'id', headerName: 'ID', width: 150, editable: true },
        { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
        { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
        { field: 'age', headerName: 'Age', width: 200 },
        { field: 'role', headerName: 'Date of admission', width: 150 }
    ];

    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    // console.log(args)

    return (
        <>
            <Layout>
                <br />
                <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile ? "1em" : "2em", paddingRight: isMobile ? "1em" : "2em" }}>
                    <TextField type={"text"} size="small" sx={{ width: "80%" }} placeholder='Patient Name or Patient ID' />
                    <Button variant="contained" size='small' sx={{ width: "20%" }} disableElevation>Search</Button>
                </Stack>
                <br /><br />
                <Container maxWidth="lg">
                    <DataGrid
                        loading={patients ? false : true}
                        rows={patients ? patients : []}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        autoHeight
                        disableSelectionOnClick
                        onCellEditStop={e => { console.log(e) }}
                        onSelectionModelChange={(selection) => {
                            if (selection.length > 1) {
                                const selectionSet = new Set(selectionModel);
                                const result = selection.filter((s) => !selectionSet.has(s));

                                setSelectionModel(result);
                            } else {
                                setSelectionModel(selection);
                            }
                        }}
                    />
                </Container>
            </Layout>
        </>
    )

}




