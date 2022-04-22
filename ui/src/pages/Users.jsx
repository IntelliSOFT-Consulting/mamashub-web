import { useState, useEffect } from 'react'
import {
    Grid, TextField, Typography, Modal, Box, Stack, Button, Alert, useMediaQuery, CardContent, LinearProgress,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import Layout from '../components/Layout'
import HeaderDrawer from '../components/HeaderDrawer'
import { getCookie } from './../lib/cookie'
import { useNavigate } from 'react-router'
import { DataGrid, GridRowsProp, GridColDef, daDK } from '@mui/x-data-grid'


export default function Users() {

    let [users, setUsers] = useState(null)
    let [open, setOpen] = useState(false);
    let [data, setData] = useState({ role: 'STAFF' })
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let [selected, setSelected] = useState([])
    let isMobile = useMediaQuery('(max-width:600px)');
    let navigate = useNavigate()

    let getUsers = async () => {
        let data = (await (await fetch(`/users`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        setUsers(data.users)
        return
    }

    let createUser = async () => {
        let response = (await (await fetch(`/users`,
            { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
            body:{username:data.username, email:data.email, "names":data.names,"role":data.role}   
        })).json())
        setUsers(response.users)
        return
    }

    useEffect(() => {
        if (getCookie("token")) {
            getUsers()
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/users")
            return
        }
    }, [])

    const columns = [
        { field: 'id', headerName: 'ID', width: 255 },
        { field: 'names', headerName: 'Names', width: 150, editable: true },
        { field: 'username', headerName: 'Username', width: 150, editable: true },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 150 }
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
                <Stack direction="row" spacing={2} alignContent="right" >
                    {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 0) ? '50%' : '80%' }}></Typography>}
                    {(selected.length > 0) &&
                        <>
                            <Button variant="contained" disableElevation sx={{ backgroundColor: 'red' }}>Delete User{(selected.length > 1) && `s`}</Button>
                            <Button variant="contained" disableElevation sx={{ backgroundColor: 'gray' }}>Reset Password</Button>
                        </>
                    }
                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }} onClick={handleOpen}>Create New User</Button>
                </Stack>
                <p></p>

                <DataGrid
                    loading={users ? false : true}
                    rows={users?users : []}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    autoHeight
                    disableSelectionOnClick
                    onSelectionModelChange={e => { setSelected(e) }}
                    onCellEditStop={e => { console.log(e) }}
                />
                {/* <><br/><br/><br/><LinearProgress variant='indeterminate'/></> */}
                {/* } */}

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
                        <br />
                        <br />
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

                            <TextField
                                sx={{ width: "100%" }}
                                type="text"
                                label="Username"
                                placeholder="Username"
                                size="small"
                                onChange={e => { setData({ ...data, username: e.target.value }) }}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={data.role}
                                    label="Role"
                                    onChange={e => { setData({ ...data, role: e.target.value }) }}
                                    size="small"
                                >
                                    <MenuItem value={"ADMINISTRATOR"}>Administrator</MenuItem>
                                    <MenuItem value={"STAFF"}>Staff</MenuItem>
                                    <MenuItem value={"PRACTITIONER"}>Practitioner</MenuItem>
                                </Select>
                            </FormControl>

                            <Button variant='contained' sx={{ backgroundColor: "#115987" }} onClick={e=>{createUser()}}>Create User</Button>
                            <br/>
                        </Stack>

                    </Box>
                </Modal>
            </Layout>
        </>
    )
}





