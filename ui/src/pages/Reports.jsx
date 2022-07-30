import { Stack, TextField, Button, Container, useMediaQuery, Snackbar, CircularProgress, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { apiHost } from '../lib/api';

import { DataGrid } from '@mui/x-data-grid';
import Layout from '../components/Layout';


export default function GeneralPatientLevel() {
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let [results, setResults] = useState([])

    const [selectionModel, setSelectionModel] = useState([]);

    let getReport = async () => {
        let data = await (await fetch(`${apiHost}/reports/general`)).json()
        if (data.status === 'success') {
            setResults(data.report)
            setOpen(true)
            setMessage("Successfully generated report generated")
            setTimeout(() => {
                setOpen(false)
            }, 1500)
            return
        }
        setOpen(true)
        setMessage("Failed to generate report")
        setTimeout(() => {
            setOpen(false)
        }, 1500)
        return
        return
    }

    useEffect(() => {
        getReport()
    }, [])
    const columns = [
        { field: 'ancNumber', headerName: 'ANC No.', width: 100, editable: true },
        { field: 'fullNames', headerName: "Full Names", width: 140, editable: true },
        { field: 'dob', headerName: 'DOB', width: 150, editable: true },
        { field: 'subCounty', headerName: 'SubCounty', width: 100 },
        { field: 'county', headerName: 'County', width: 100 },
        { field: 'village', headerName: 'Village', width: 100 },
        { field: 'estate', headerName: 'Estate', width: 100 },
        { field: 'tel', headerName: 'Tel', width: 100 },
        { field: 'maritalStatus', headerName: 'Marital Status', width: 100 },
        { field: 'parity', headerName: 'Parity', width: 100 },
        { field: 'gravidae', headerName: 'Gravidae', width: 100 },
        { field: 'lmp', headerName: 'LMP', width: 100 },
        { field: 'edd', headerName: 'EDD', width: 100 },
    ];

    return (
        <>

            <br />
            <Layout>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    onClose={e => { console.log(e) }}
                    message={message}
                    key={"loginAlert"}
                />

                <br />
                <Container maxWidth="lg">
                    <br />
                    <Button variant="contained"
                        disableElevation
                        sx={{ width: "20%", backgroundColor: "#632165", borderRadius: "10px", float: "right" }}>Export Report</Button>

                    <br />
                    <br />
                    {results.length > 0 ? <DataGrid
                        loading={!results}
                        rows={results ? results : []}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        autoHeight
                        disableSelectionOnClick={true}
                        onCellEditStop={e => { console.log(e) }}
                    /> : <>
                    <CircularProgress />
                    <Typography variant='h5'>Loading Report..</Typography>
                    </>}
                </Container>
            </Layout>
        </>
    )

}



