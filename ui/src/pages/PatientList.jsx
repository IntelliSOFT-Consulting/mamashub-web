import { Paper, Stack, TextField, Button, Container, useMediaQuery } from '@mui/material'
import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';



export default function PatientList() {
    let [patients, setPatients] = useState()
    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 255 },
        { field: 'names', headerName: 'Last Name', width: 150, editable: true },
        { field: 'username', headerName: 'First Name', width: 150, editable: true },
        { field: 'email', headerName: 'Age', width: 200 },
        { field: 'role', headerName: 'Date of admission', width: 150 }
    ];
    // const style = {
    //     position: 'absolute',
    //     top: '50%',
    //     left: '50%',
    //     transform: 'translate(-50%, -50%)',
    //     width: 600,
    //     bgcolor: 'background.paper',
    //     border: '2px solid #000',
    //     boxShadow: 24,
    //     p: 4,
    // };
    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    // console.log(args)

    let getPatients = async () => {
        return
    }

    return (
        <>
            <Layout>
                <br />
                <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile ? "1em" : "2em", paddingRight: isMobile ? "1em" : "2em" }}>
                    <TextField type={"text"} size="small" sx={{ width: "90%" }} placeholder='Patient Name or Patient ID' />
                    <Button variant="contained" size='small' disableElevation>Search</Button>
                    <Button variant="contained" size='small' disableElevation>Action</Button>
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




