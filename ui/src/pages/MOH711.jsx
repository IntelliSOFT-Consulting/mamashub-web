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
import { useState, useEffect } from "react";
import { apiHost, FhirApi } from "../lib/api";
import { exportToCsv } from "../lib/exportCSV";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

export default function MOH711Report() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [results, setResults] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");

  let getReport = async () => {
    let data = await (await FhirApi({ url: `/reports/moh-711` })).data;
    setLoading(false);
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
    if (Object.keys(results).length > 0) {
      data = Object.keys(results).map((result) => {
        // console.log(result, results[result])
        console.log(Object.keys(results).indexOf(result));
        return [
          columns[Object.keys(results).indexOf(result)]?.title || result,
          results[result],
        ];
      });
    }
    console.log(data);
    let rows = data;
    exportToCsv(`MOH 711 ANC - ${new Date().toISOString()}.csv`, rows);
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
    { field: "newAncClients", title: "New ANC Clients", width: 150 },
    { field: "revisitAncClients", title: "Revisiting ANC Clients", width: 150 },
    { field: "iptDose1", title: "IPT Dose 1", width: 150 },
    { field: "iptDose2", title: "IPT Dose 2", width: 150 },
    { field: "iptDose3", title: "IPT Does 3", width: 150 },
    { field: "hb", title: "HB", width: 120 },
    {
      field: "completed4ANCVisits",
      title: "Completed 4 ANC Visits",
      width: 130,
    },
    { field: "LLINSUnder1Year", title: "LLINS Under 1 year", width: 100 },
    { field: "LLINSToAncClients", title: "LLINS To ANC Clients", width: 100 },
    { field: "testedForSyphylis", title: "Tested for Syphyllis", width: 120 },
    { field: "hivPositive", title: "HIV Positive", width: 120 },
    {
      field: "doneBreastExamination",
      title: "Done breast examination.",
      width: 100,
    },
    {
      field: "10-14",
      title:
        "No. of adolescents (10 -14 years) presenting with pregnancy at first ANC Visit",
    },
    {
      field: "15-19",
      title:
        "No. of adolescents (15 -19 years) presenting with pregnancy at first ANC Visit",
      width: 100,
    },
    {
      field: "20-24",
      title:
        "No. of youths (20 -24 years) presenting with pregnancy at first ANC Visit",
      width: 100,
    },
    {
      field: "pregnancyAtFirstAnc",
      title: "Pregnancy At First ANC",
      width: 130,
    },
    { field: "issuedWithIron", title: "Issued With Iron", width: 80 },
    { field: "issuedWithFolic", title: "Issued With Folic", width: 120 },
    {
      field: "issuedWithCombinedFF",
      title: "Issued With Combined FF",
      width: 120,
    },
    {
      field: "FGMAssociatedComplication",
      title: "FGM Associated Complication",
      width: 120,
    },
    {
      field: "totalScreened",
      title: "Total No. of people Screened",
      width: 120,
    },
    {
      field: "alreadyOnTB",
      title: "Total No. of presumptiveTBCases",
      width: 120,
    },
    {
      field: "totalNotScreened",
      title: "Total No. of Women not screened",
      width: 120,
    },
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
          <Grid container spacing={1} padding=".5em">
            {/* <Grid item xs={12} md={12} lg={4}>
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
            </Grid> */}
            <Grid item xs={12} md={12} lg={3}>
              <Button
                variant="contained"
                disableElevation
                disabled={Object.keys(results).length < 1}
                onClick={(e) => {
                  exportReport();
                }}
                sx={{
                  backgroundColor: "#632165",
                  borderRadius: "10px",
                  float: "right",
                }}
              >
                Export Report
              </Button>
            </Grid>
          </Grid>

          <br />
          <br />
          {!loading && Object.keys(results).length > 0 ? (
            <TableContainer component={Paper} sx={{ maxWidth: "65%" }}>
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
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell align="right">{results[row.field]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
