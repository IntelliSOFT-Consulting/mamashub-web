import { useState, useEffect } from 'react'
import {
    Grid, TextField, Typography, Modal, Box, Stack, Button, Alert, useMediaQuery, CardContent, LinearProgress,
    FormControl, InputLabel, Select, MenuItem, Snackbar
} from '@mui/material'
import Layout from '../components/Layout'
import { getCookie } from './../lib/cookie'
import { useNavigate } from 'react-router'
import { DataGrid } from '@mui/x-data-grid'
import { apiHost } from '../lib/api'

export default function Users() {

    let [facilities, setFacilities] = useState([])
    let [open, setOpen] = useState(false);
    let [data, setData] = useState({})
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let [selected, setSelected] = useState([])
    let isMobile = useMediaQuery('(max-width:600px)');
    let navigate = useNavigate()
    let [openSnackBar, setOpenSnackBar] = useState(false)
    let [message, setMessage] = useState(false)

    // fetch users
    let getFacilities = async () => {
        let data = (await (await fetch(`${apiHost}/admin/facilities`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        setFacilities(data.facilities)
        return
    }

    // delete users
    let deleteFacilities = async () => {
        for (let i of selected) {
            setOpenSnackBar(false)
            let response = (await (await fetch(`${apiHost}/admin/facilities/${i}`,
                {
                    method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
                })).json())
            if (response.status === "error") {
                setMessage(response.error || response.message)
                setOpenSnackBar(true)
                return
            }
            getFacilities()
            setOpen(false)
        }
        return
    }

    // create user
    let createFacility = async () => {
        setOpenSnackBar(false)
        let response = (await (await fetch(`${apiHost}/admin/facilities`,
            {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
                body: JSON.stringify({ kmhflCode: data.kmhflCode, county: data.county, "name": data.name, "subCounty": data.subCounty, ward: data.ward })
            })).json())
        if (response.status === "error") {
            setMessage(response.error || response.message)
            setOpenSnackBar(true)
            return
        }
        getFacilities()
        setOpen(false)
        return
    }

    useEffect(() => {
        if (getCookie("token")) {
            getFacilities()
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/facilities")
            return
        }
    }, [])

    const columns = [
        { field: 'kmhflCode', headerName: 'KMHFL Code', width: 200 },
        { field: 'name', headerName: 'Facility Name', width: 250 },
        { field: 'data', headerName: 'County', width: 200, valueFormatter: ({ value }) => value.county },
        // { field: 'data', headerName: 'Sub-County', width: 200, valueFormatter: ({ value }) => value.subCounty },
    ];
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openSnackBar}
                    onClose={""}
                    message={message}
                    key={"loginAlert"}
                />
                <Stack direction="row" spacing={2} alignContent="right" >
                    {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 0) ? '65%' : '80%' }}></Typography>}
                    {(selected.length > 0) &&
                        <>
                            <Button variant="contained" onClick={e => { deleteFacilities() }} disableElevation sx={{ backgroundColor: 'red' }}>Delete Facility{(selected.length > 1) && `s`}</Button>
                        </>
                    }
                    
                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }} onClick={handleOpen}>Add New Facility</Button>
                </Stack>
                <p></p>
                <DataGrid
                    getRowId={(row) => row.kmhflCode}
                    loading={facilities ? false : true}
                    rows={facilities ? facilities : []}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    autoHeight
                    disableSelectionOnClick
                    onSelectionModelChange={e => { setSelected(e) }}
                    onCellEditStop={e => { console.log(e) }}
                />
                {/* Add User Modal  */}
                <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                            ADD NEW USER
                        </Typography>
                        <Typography variant="p">Provide user information below</Typography>
                        <br /><br />
                        <Stack direction="column" spacing={2}>
                            <TextField
                                sx={{ width: "100%" }}
                                type="text"
                                label="KMHFL Code"
                                placeholder="KMHFL Code"
                                size="small"
                                onChange={e => { setData({ ...data, kmhflCode: e.target.value }) }}
                            />
                            <TextField
                                sx={{ width: "100%" }}
                                type="email"
                                label="Facility Name"
                                placeholder="Facility Name"
                                size="small"
                                onChange={e => { setData({ ...data, name: e.target.value }) }}
                            />
                            <TextField
                                sx={{ width: "100%" }}
                                type="text"
                                label="County"
                                placeholder="County"
                                size="small"
                                onChange={e => { setData({ ...data, county: e.target.value }) }}
                            />
                            <TextField
                                sx={{ width: "100%" }}
                                type="text"
                                label="Sub-County"
                                placeholder="Sub-County"
                                size="small"
                                onChange={e => { setData({ ...data, subCounty: e.target.value }) }}
                            />
                            <TextField
                                sx={{ width: "100%" }}
                                type="text"
                                label="Ward"
                                placeholder="Ward"
                                size="small"
                                onChange={e => { setData({ ...data, ward: e.target.value }) }}
                            />
                            
                            <Button variant='contained' sx={{ backgroundColor: "#632165" }} onClick={e => { createFacility() }}>Create Facility</Button>
                            <br />
                        </Stack>
                    </Box>
                </Modal>
            
        </>
    )
}





