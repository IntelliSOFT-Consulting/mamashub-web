import { useState, useEffect } from 'react'
import {
    Grid, Container, Typography, Card, Stack, Button, Alert, useMediaQuery, CardContent, LinearProgress
} from '@mui/material'
import Layout from '../components/Layout'
import HeaderDrawer from '../components/HeaderDrawer'
import { getCookie } from './../lib/cookie'
import { useNavigate } from 'react-router'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'


export default function Users() {

    let [users, setUsers] = useState(null)
    let [selected, setSelected] = useState([])
    let isMobile = useMediaQuery('(max-width:600px)');
    let navigate = useNavigate()

    let getUsers = async () => {
        let data = (await (await fetch(`/users`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        setUsers(data.users)
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

    return (
        <>
            <Layout>
                <Stack direction="row" spacing={2} alignContent="right" >
                    {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 0) ? '50%': '80%' }}></Typography>}
                    {(selected.length > 0) && 
                        <>
                        <Button variant="contained" disableElevation sx={{ backgroundColor: 'red' }}>Delete User{(selected.length > 1) && `s`}</Button>
                        <Button variant="contained" disableElevation sx={{ backgroundColor: 'gray' }}>Reset Password</Button>
                        </>
                    }
                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Create New User</Button>
                </Stack>
                <p></p>

                {users ? <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    autoHeight
                    disableSelectionOnClick
                    onSelectionModelChange={e=>{setSelected(e)}}
                    onCellEditStop={e=>{console.log(e)}}
                />: 
                <><br/><br/><br/><LinearProgress variant='indeterminate'/></>
                }
            </Layout>
        </>
    )
}





