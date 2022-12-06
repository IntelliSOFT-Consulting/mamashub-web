import {
  Box,
  Grid,
  Modal,
  Button,
  Container,
  useMediaQuery,
  Snackbar,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Typography,
  TextField,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useState, useEffect } from "react";
import { apiHost, FhirApi } from "../lib/api";
import { exportToCsv } from "../lib/exportCSV";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function GeneralPatientLevel() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [results, setResults] = useState([]);
  const [data, setData] = useState({});
  const isMobile = useMediaQuery("(max-width:600px)");

  const [selected, setSelected] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);

  let getReport = async () => {
    let data = await FhirApi({ url: `/reports/moh-405` });
    data = data.data;
    if (data.status === "success") {
      setResults(data.report);
      setOpen(true);
      setMessage("Successfully generated report");
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      return;
    }
    setOpen(true);
    setMessage("Failed to generate report");
    setTimeout(() => {
      setOpen(false);
    }, 1500);
    return;
  };

  const exportReport = async () => {
    console.log(results);
    let header = [];
    let data = [];
    if (results.length > 0) {
      header = Object.keys(results[0]).map((x) => {
        return x;
      });
      data = results.map((result) => {
        return Object.keys(result).map((r) => {
          return result[r];
        });
      });
    }
    console.log(data);
    let rows = [header].concat(data);
    exportToCsv(`MOH 405 ANC - ${new Date().toISOString()}.csv`, rows);
    return;
  };

  const handleClose = async () => {
    setOpenModal(false);
    setData(null);
    setSelected(null);
    return;
  };

  useEffect(() => {
    getReport();
  }, []);

  const columns = [
    { field: "ancNumber", headerName: "ANC No.", width: 150 },
    { field: "fullNames", headerName: "Full Names", width: 140 },
    { field: "dob", headerName: "DOB", width: 150 },
    { field: "noOfAncVisits", headerName: "No of ANC Visits", width: 150 },
    { field: "subCounty", headerName: "Sub County", width: 150 },
    { field: "county", headerName: "County", width: 150 },
    { field: "village", headerName: "Village", width: 150 },
    { field: "estate", headerName: "Estate", width: 150 },
    { field: "tel", headerName: "Tel", width: 120 },
    { field: "maritalStatus", headerName: "Marital Status", width: 130 },
    { field: "parity", headerName: "Parity", width: 100 },
    { field: "gravidae", headerName: "Gravidae", width: 100 },
    { field: "lmp", headerName: "LMP", width: 120 },
    { field: "edd", headerName: "EDD", width: 120 },
    { field: "gestation", headerName: "Gestation", width: 100 },
    { field: "muacCodes", headerName: "MUAC", width: 100 },
    { field: "bodyHeight", headerName: "Height", width: 100 },
    { field: "bodyWeight", headerName: "Weight", width: 100 },
    { field: "breastExam", headerName: "Breast Exam", width: 130 },
    { field: "fgm", headerName: "FGM", width: 80 },
    { field: "haemoglobinTest", headerName: "Haemoglobon", width: 120 },
    { field: "bloodRBSTest", headerName: "Blood Sugar", width: 120 },
    { field: "bloodGroup", headerName: "Blood Group", width: 120 },
    { field: "rhesus", headerName: "Rhesus", width: 120 },
    { field: "urynalysis", headerName: "Urynalysis", width: 100 },
    { field: "dualTesting", headerName: "Dual Testing", width: 120 },
    { field: "testResults", headerName: "Test Results", width: 120 },
    { field: "treated", headerName: "Treated", width: 80 },
    {
      field: "hivStatusBeforeANC",
      headerName: "HIV Testing before ANC",
      width: 200,
    },
    { field: "hivTesting", headerName: "HIV Testing", width: 150 },
    { field: "hivResults", headerName: "HIV Results", width: 150 },
    { field: "artEligibility", headerName: "ART Eligibility", width: 150 },
    {
      field: "maternalHaartBeforeANC",
      headerName: "Maternal HAART before ANC",
      width: 200,
    },
    { field: "maternalHaartCTX", headerName: "Maternal HAART CTX", width: 200 },
    {
      field: "infantProphylaxis",
      headerName: "Infant Prophylaxis",
      width: 160,
    },
    {
      field: "partnerHIVTesting",
      headerName: "Partner HIV Testing",
      width: 160,
    },
    {
      field: "partnerHIVResults",
      headerName: "Partner HIV Results",
      width: 160,
    },
    { field: "ppfpCounselling", headerName: "PPFP Counselling", width: 160 },
    { field: "otherConditions", headerName: "Other Conditions", width: 160 },
    { field: "deworming", headerName: "Deworming", width: 120 },
    { field: "malariaProphylaxisIPTpSp", headerName: "IPT", width: 100 },
    { field: "ttDose", headerName: "TT Dose", width: 120 },
    { field: "iFASIronSuppliments", headerName: "Supplimentation", width: 150 },
    { field: "receivedLLITN", headerName: "Received LLITN", width: 150 },
    { field: "referralsFrom", headerName: "Referrals from", width: 150 },
    { field: "referralsTo", headerName: "Referrals to", width: 150 },
    {
      field: "reasonsForReferral",
      headerName: "Reasons for referral",
      width: 200,
    },
    { field: "remarks", headerName: "Remarks", width: 100 },
  ];
  // const [indicators, setIndicators] = useState(columns)

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  let [openModal, setOpenModal] = useState(false);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={(e) => {
            console.log(e);
          }}
          message={message}
          key={"loginAlert"}
        />

        <Container maxWidth="lg">
          {/* {results.length > 0 && <Button variant="contained"
                        disableElevation
                        onClick={e => { setOpenModal(true) }}
                        sx={{ width: "20%", backgroundColor: "#632165", borderRadius: "10px", float: "right" }}>Select Indicators</Button>} */}

          <br />
          <Grid container spacing={1} padding=".5em">
            <Grid item xs={12} md={12} lg={4}>
              {!isMobile ? (
                <DesktopDatePicker
                  label="From Date"
                  inputFormat="dd/MM/yyyy"
                  value={
                    data.fromDate
                      ? data.fromDate
                      : new Date().setFullYear(2000).toString()
                  }
                  onChange={(e) => {
                    console.log(e);
                    setData({ ...data, fromDate: new Date(e).toISOString() });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              ) : (
                <MobileDatePicker
                  label="From Date"
                  inputFormat="dd/MM/yyyy"
                  value={
                    data.fromDate
                      ? data.fromDate
                      : new Date().setFullYear(2000).toISOString()
                  }
                  onChange={(e) => {
                    console.log(e);
                    setData({ ...data, fromDate: new Date(e).toISOString() });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              )}
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              {!isMobile ? (
                <DesktopDatePicker
                  label="To Date"
                  inputFormat="dd/MM/yyyy"
                  value={
                    data.toDate
                      ? data.toDate
                      : new Date().setHours(23).toString()
                  }
                  onChange={(e) => {
                    console.log(e);
                    setData({ ...data, toDate: new Date(e).toISOString() });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              ) : (
                <MobileDatePicker
                  label="To Date"
                  inputFormat="dd/MM/yyyy"
                  value={
                    data.toDate
                      ? data.toDate
                      : new Date().setHours(23).toISOString()
                  }
                  onChange={(e) => {
                    console.log(e);
                    setData({ ...data, toDate: new Date(e).toISOString() });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              )}
            </Grid>
            <Grid item xs={12} md={12} lg={3}>
              <Button
                variant="contained"
                disableElevation
                disabled={results.length < 1}
                onClick={(e) => {
                  exportReport();
                }}
                sx={{
                  // width: "20%",
                  backgroundColor: "#632165",
                  borderRadius: "10px",
                  float: "right",
                }}
              >
                Export Report
              </Button>
            </Grid>
          </Grid>
          {results.length > 0 ? (
            <DataGrid
              loading={!results}
              rows={results ? results : []}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              autoHeight
              disableSelectionOnClick={true}
              onCellEditStop={(e) => {
                console.log(e);
              }}
            />
          ) : (
            <>
              <CircularProgress />
              <Typography variant="h5">Loading Report..</Typography>
            </>
          )}
          <Modal
            keepMounted
            open={openModal}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...modalStyle, width: "80%", borderRadius: "10px" }}>
              <Grid container justifyContent="center" alignItems="center">
                {columns.slice(3).map((column) => {
                  return (
                    <Grid item xs={3} lg={3} md={2}>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label={column.headerName}
                      />
                    </Grid>
                  );
                })}
              </Grid>
              <Button variant="contained">Generate Report</Button>
            </Box>
          </Modal>
        </Container>
      </LocalizationProvider>
    </>
  );
}
