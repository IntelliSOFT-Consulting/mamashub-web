import { Box, Grid, Modal, Button, Container, useMediaQuery, Snackbar, CircularProgress, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { apiHost } from '../lib/api';

import { DataGrid } from '@mui/x-data-grid';
import Layout from '../components/Layout';


export default function GeneralPatientLevel() {
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let [results, setResults] = useState([])
    let [data, setData] = useState({})
    let [selected, setSelected] = useState({})
    let [indicators, setIndicators] = useState([])

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
    }

    let handleClose = async () => {
        setOpenModal(false)
        setData(null)
        setSelected(null)
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
        { field: 'maritalStatus', headerName: 'Marital Status', width: 130 },
        { field: 'parity', headerName: 'Parity', width: 100 },
        { field: 'gravidae', headerName: 'Gravidae', width: 100 },
        { field: 'lmp', headerName: 'LMP', width: 80 },
        { field: 'edd', headerName: 'EDD', width: 80 },
        { field: 'gestation', headerName: 'Gestation', width: 100 },
        { field: 'muacCodes', headerName: 'MUAC', width: 100 },
        { field: 'height', headerName: 'Height', width: 100 },
        { field: 'breastExam', headerName: 'Breast Exam', width: 130 },
        { field: 'fgm', headerName: 'FGM', width: 80 },
        { field: 'haemoglobin', headerName: 'Haemoglobon', width: 120 },
        { field: 'bloodSugar', headerName: 'Blood Sugar', width: 100 },
        { field: 'bloodGroupAndRhesus', headerName: 'Blood Group and Rhesus', width: 180 },
        { field: 'urynalysis', headerName: 'Urynalysis', width: 100 },
        { field: 'dualTesting', headerName: 'Dual Testing', width: 120 },
        { field: 'testResults', headerName: 'Test Results', width: 120 },
        { field: 'treated', headerName: 'Treated', width: 80 },
        { field: 'hivStatusBeforeANC', headerName: 'HIV Testing before ANC', width: 200 },
        { field: 'hivTesting', headerName: 'HIV Testing', width: 150 },
        { field: 'hivTesting1', headerName: 'HIV Testing 1', width: 150 },
        { field: 'hivTesting2', headerName: 'HIV Testing 2', width: 150 },
        { field: 'hivResults', headerName: 'HIV Results', width: 150 },
        { field: 'artEligibility', headerName: 'ART Eligibility', width: 150 },
        { field: 'maternalHaartBeforeANC', headerName: 'Maternal HAART before ANC', width: 200 },
        { field: 'maternalHaartCTX', headerName: 'Maternal HAART CTX', width: 200 },
        { field: 'infantProphylaxis', headerName: 'Infant Prophylaxis', width: 160 },
        { field: 'partnerHIVTesting', headerName: 'Partner HIV Testing', width: 160 },
        { field: 'partnerHIVResults', headerName: 'Partner HIV Results', width: 160 },
        { field: 'ppfpCounselling', headerName: 'PPFP Counselling', width: 160 },
        { field: 'otherConditions', headerName: 'Other Conditions', width: 160 },
        { field: 'deworming', headerName: 'Deworming', width: 120 },
        { field: 'ipt', headerName: 'IPT', width: 100 },
        { field: 'ttDose', headerName: 'TT Dose', width: 120 },
        { field: 'supplimentation', headerName: 'Supplimentation', width: 150 },
        { field: 'receivedLLITN', headerName: 'Received LLITN', width: 150 },
        { field: 'referralsFrom', headerName: 'Referrals from', width: 150 },
        { field: 'referralsTo', headerName: 'Referrals to', width: 150 },
        { field: 'reasonsForReferral', headerName: 'Reasons for referral', width: 200 },
        { field: 'remarks', headerName: 'Remarks', width: 100 },
    ];
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
                                <Grid item xs={12} lg={12} md={12}></Grid>
                            </Grid>
                        </Box>
                    </Modal>

                </Container>
            </Layout>
        </>
    )

}



