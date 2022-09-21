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

    let [users, setUsers] = useState(null)
    let [open, setOpen] = useState(false);
    let [data, setData] = useState({})
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let [selected, setSelected] = useState([])
    let isMobile = useMediaQuery('(max-width:600px)');
    let navigate = useNavigate()
    let [openSnackBar, setOpenSnackBar] = useState(false)
    let [message, setMessage] = useState(false)
    let [role, setRole] = useState(null)
    let [kmhflCode, setKmhflCode] = useState(null)


    function prompt(text) {
        setMessage(text)
        setOpenSnackBar(true)
        setTimeout(() => {
            setOpenSnackBar(false)
        }, 4000)
        return
    }


    let getProfile = async () => {
        let _data = (await (await fetch("/auth/me",
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
            })).json())
        console.log(_data)
        if (!(_data.data.role == "ADMINISTRATOR" || _data.data.role === "FACILITY_ADMINISTRATOR")) {
            prompt("You are not authorized to access this page")
            navigate('/')
            return
        }
        setKmhflCode(_data.data.kmhflCode)
        // console.log(data)
        setRole(_data.data.role)
        return
    }


    // fetch users
    let getUsers = async () => {
        let data = (await (await fetch(`${apiHost}/users`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        setUsers(data.users);
        return;
    }

    // delete users
    let deleteUsers = async () => {
        for (let i of selected) {
            setOpenSnackBar(false)
            let response = (await (await fetch(`${apiHost}/auth/${i}`,
                {
                    method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
                })).json())
            if (response.status === "error") {
                setMessage(response.error || response.message)
                setOpenSnackBar(true)
                return
            }
            getUsers()
            setOpen(false)
        }
        return
    }

    // reset Password
    let resetPassword = async () => {
        for (let i of selected) {
            setOpenSnackBar(false)
            let response = (await (await fetch(`${apiHost}/auth/reset-password`,
                {
                    method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
                    body: JSON.stringify({ id: i })
                })).json())
            if (response.status === "error") {
                setMessage(response.error || response.message)
                setOpenSnackBar(true)
                return
            }
            getUsers()
            setMessage(response.error || response.message)
            setOpenSnackBar(true)
            setTimeout(() => {
                setOpenSnackBar(false)
            }, 3000);
        }
        return
    }

    // create user
    let createUser = async () => {
        setOpenSnackBar(false)
        let response = (await (await fetch(`${apiHost}/auth/register`,
            {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
                body: JSON.stringify({ email: data.email, names: data.names, role: data.role, kmhflCode })
            })).json());
        if (response.status === "error") {
            setMessage(response.error || response.message);
            setOpenSnackBar(true);
            return
        }
        prompt(`Successfully created user`)
        getUsers();
        setOpen(false);
        return
    }

    useEffect(() => {
        if (getCookie("token")) {
            getProfile();
            getUsers();
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/users")
            return
        }
    }, [])

    const columns = [
        // { field: 'id', headerName: 'ID', width: 100 },
        { field: 'names', headerName: 'Names', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 200 },
        { field: 'facility', headerName: 'Assigned Facility', width: 200, valueFormatter: ({ value }) => value.name },
        { field: 'facilityKmhflCode', headerName: 'KMHFL Code', width: 150 }
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
            <Layout>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openSnackBar}
                    onClose={""}
                    message={message}
                    key={"loginAlert"}
                />
                <Stack direction="row" spacing={2} alignContent="right" >
                    {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 0) ? '50%' : '80%' }}></Typography>}
                    {(selected.length > 0) &&
                        <>
                            <Button variant="contained" onClick={e => { deleteUsers() }} disableElevation sx={{ backgroundColor: 'red' }}>Delete User{(selected.length > 1) && `s`}</Button>
                        </>
                    }
                    {(selected.length === 1) &&
                        <Button variant="contained" disableElevation sx={{ backgroundColor: 'gray' }} onClick={e => { resetPassword() }}>Reset Password</Button>
                    }
                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }} onClick={handleOpen}>Create New User</Button>
                </Stack>
                <p></p>
                <DataGrid
                    loading={users ? false : true}
                    rows={users ? users : []}
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
                                label="Names"
                                placeholder="Names"
                                size="small"
                                onChange={e => { setData({ ...data, names: e.target.value }) }}
                            />
                            <TextField
                                sx={{ width: "100%" }}
                                type="email"
                                label="Email Address"
                                placeholder="Email Address"
                                size="small"
                                onChange={e => { setData({ ...data, email: e.target.value }) }}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={data.role}
                                    label="Role"
                                    onChange={e => { setData({ ...data, role: e.target.value }) }}
                                    size="small"
                                >
                                    {role === "ADMINISTRATOR" && <><MenuItem value={"ADMINISTRATOR"}>Administrator</MenuItem>
                                        <MenuItem value={"FACILITY_ADMINISTRATOR"}>Facility Administrator</MenuItem></>}
                                    <MenuItem value={"NURSE"}>Nurse/Clinical Officer</MenuItem>
                                    <MenuItem value={"CLINICIAN"}>Clinician</MenuItem>
                                    <MenuItem value={"CHW"}>CHW</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant='contained' sx={{ backgroundColor: "#632165" }} onClick={e => { createUser() }}>Create User</Button>
                            <br />
                        </Stack>
                    </Box>
                </Modal>
            </Layout>
        </>
    )
}





