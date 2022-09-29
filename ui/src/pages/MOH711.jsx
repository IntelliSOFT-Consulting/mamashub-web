import { Box, Grid, Modal, Button, Container, useMediaQuery, Snackbar, Checkbox, FormControlLabel, CircularProgress, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { apiHost } from '../lib/api';
import { exportToCsv } from '../lib/exportCSV';
import { DataGrid } from '@mui/x-data-grid';
import Layout from '../components/Layout';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function MOH711Report() {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState(false)
    const [results, setResults] = useState({})
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState({})
    const [selectionModel, setSelectionModel] = useState([]);

    let getReport = async () => {
        let data = await (await fetch(`${apiHost}/reports/moh-711`)).json()
        setLoading(false)
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

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

    useEffect(() => {
        getReport()
    }, [])

    const columns = [
        { field: 'newAncClients', title: 'New ANC Clients', width: 150 },
        { field: 'revisitAncClients', title: 'Revisiting ANC Clients', width: 150 },
        { field: 'iptDose1', title: 'IPT Dose 1', width: 150 },
        { field: 'iptDose2', title: 'IPT Dose 2', width: 150 },
        { field: 'iptDose3', title: 'IPT Does 3', width: 150 },
        { field: 'hb', title: 'HB', width: 120 },
        { field: 'completed4ANCVisits', title: 'Completed 4 ANC Visits', width: 130 },
        { field: 'LLINSUnder1Year', title: 'LLINS Under 1 year', width: 100 },
        { field: 'LLINSToAncClients', title: 'LLINS To ANC Clients', width: 100 },
        { field: 'testedForSyphylis', title: 'Tested for syphillis', width: 120 },
        { field: 'hivPositive', title: 'HIV Positive', width: 120 },
        { field: 'doneBreastExamination', title: 'Done breast examination.', width: 100 },
        { field: '10-14', title: '10-14' },
        { field: '15-19', title: '15-19', width: 100 },
        { field: '20-24', title: '20-24', width: 100 },
        { field: 'pregnancyAtFirstAnc', title: 'Pregnancy At First Anc', width: 130 },
        { field: 'issuedWithIron', title: 'Issued With Iron', width: 80 },
        { field: 'issuedWithFolic', title: 'Issued With Folic', width: 120 },
        { field: 'issuedWithCombinedFF', title: 'Issued With Combined FF', width: 120 },
        { field: 'FGMAssociatedComplication', title: 'FGM Associated Complication', width: 120 },
        { field: 'totalScreened', title: 'TotalScreened', width: 120 },
        { field: 'presumptiveTBCases', title: 'Urynalysis', width: 100 },
        { field: 'alreadyOnTB', title: 'PresumptiveTBCases', width: 120 },
        { field: 'totalNotScreened', title: 'TotalNotScreened', width: 120 },];
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
                    <Button variant="contained"
                        disableElevation
                        disabled={Object.keys(results).length< 1}
                        onClick={e => { exportReport() }}
                        sx={{ width: "20%", backgroundColor: "#632165", borderRadius: "10px", float: "right" }}>Export Report</Button>

                    <br />
                    <br />
                    {(!loading && Object.keys(results).length > 0) ? <TableContainer component={Paper} sx={{ maxWidth: "65%" }}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>(-)</TableCell>
                                    <TableCell align="right">Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {columns.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="right">{results[row.field]}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> : <>
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