import { Box, Grid, Modal, Button, Container, useMediaQuery, Snackbar, Checkbox, FormControlLabel, CircularProgress, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { apiHost } from '../lib/api';
import { exportToCsv } from '../lib/exportCSV';
import { DataGrid } from '@mui/x-data-grid';
import Layout from '../components/Layout';


export default function MOH711Report() {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState(false)
    const [results, setResults] = useState([])
    const [data, setData] = useState({})
    const [selected, setSelected] = useState({})
    const [selectionModel, setSelectionModel] = useState([]);

    let getReport = async () => {
        let data = await (await fetch(`${apiHost}/reports/moh-711`)).json()
        if (data.status === 'success') {
            setResults(data.report)
            setOpen(true)
            setMessage("Successfully generated report generated")
            setTimeout(() => {
                setOpen(false);
            }, 1500);
            return
        }
        setOpen(true)
        setMessage("Failed to generate report")
        setTimeout(() => {
            setOpen(false)
        }, 1500)
        return
    }


    const exportReport = async () => {

        console.log(results)
        let header = []
        let data = []
        if (results.length > 0) {
            header = Object.keys(results[0]).map((x) => {
                return x
            })
            data = results.map((result) => {
                return Object.keys(result).map((r) => {
                    return result[r]
                })
            })
        }
        console.log(data)
        let rows = [header].concat(data)
        exportToCsv(`MOH 711 ANC - ${new Date().toISOString()}.csv`, rows)
        return
    }

    const handleClose = async () => {
        setOpenModal(false)
        setData(null)
        setSelected(null)
        return
    }

    useEffect(() => {
        getReport()
    }, [])

    const columns = [
        { field: 'newAncClients', headerName: 'No of ANC Visits', width: 150 },
        { field: 'revisitAncClients', headerName: 'Sub County', width: 150 },
        { field: 'iptDose1', headerName: 'IPT Dose 1', width: 150 },
        { field: 'iptDose2', headerName: 'Village', width: 150 },
        { field: 'iptDose3', headerName: 'IPT Does 3', width: 150 },
        { field: 'hb', headerName: 'HB', width: 120 },
        { field: 'completed4ANCVisits', headerName: 'Completed 4 ANC Visits', width: 130 },
        { field: 'LLINSUnder1Year', headerName: 'LLINS Under 1 year', width: 100 },
        { field: 'LLINSToAncClients', headerName: 'LLINS To ANC Clients', width: 100 },
        { field: 'testedForSyphylis', headerName: 'Tested for syphillis', width: 120 },
        { field: 'hivPositive', headerName: 'HIV Positive', width: 120 },
        { field: 'doneBreastExamination', headerName: 'Done breast examination.', width: 100 },
        { field: '10-14', headerName: 'MUAC', width: 100 },
        { field: '15-19', headerName: 'Height', width: 100 },
        { field: '20-24', headerName: 'Weight', width: 100 },
        { field: 'pregnancyAtFirstAnc', headerName: 'pregnancyAtFirstAnc', width: 130 },
        { field: 'issuedWithIron', headerName: 'issuedWithIron', width: 80 },
        { field: 'issuedWithFolic', headerName: 'issuedWithFolic', width: 120 },
        { field: 'issuedWithCombinedFF', headerName: 'issuedWithCombinedFF', width: 120 },
        { field: 'FGMAssociatedComplication', headerName: 'FGMAssociatedComplication', width: 120 },
        { field: 'totalScreened', headerName: 'totalScreened', width: 120 },
        { field: 'presumptiveTBCases', headerName: 'Urynalysis', width: 100 },
        { field: 'alreadyOnTB', headerName: 'presumptiveTBCases', width: 120 },
        { field: 'totalNotScreened', headerName: 'totalNotScreened', width: 120 },];
    // const [indicators, setIndicators] = useState(columns)


    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    let [openModal, setOpenModal] = useState(false)

    return (
        <>
            <Layout>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    onClose={e => { console.log(e) }}
                    message={message}
                    key={"loginAlert"}
                />

                <Container maxWidth="lg">
                    <br />
                    {/* {results.length > 0 && <Button variant="contained"
                        disableElevation
                        onClick={e => { setOpenModal(true) }}
                        sx={{ width: "20%", backgroundColor: "#632165", borderRadius: "10px", float: "right" }}>Select Indicators</Button>} */}
                    <Button variant="contained"
                        disableElevation
                        disabled={results.length < 1}
                        onClick={e => { exportReport() }}
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
                    <Modal keepMounted
                        open={openModal}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={{ ...modalStyle, width: "80%", borderRadius: "10px" }}>
                            <Grid container
                                justifyContent="center"
                                alignItems="center"
                            >
                                {columns.slice(3).map((column) => {
                                    return <Grid item xs={3} lg={3} md={2}>
                                        <FormControlLabel control={<Checkbox defaultChecked />} label={column.headerName} />
                                    </Grid>
                                })}
                            </Grid>
                            <Button variant='contained'>Generate Report</Button>
                        </Box>

                    </Modal>

                </Container>
            </Layout>
        </>
    )

}