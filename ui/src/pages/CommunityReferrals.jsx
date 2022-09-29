import { Typography, Stack, TextField, Button, Container, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from '../lib/cookie';
import { apiHost } from '../lib/api';

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

export default function PatientList() {
    let [referrals, setReferrals] = useState([])
    let navigate = useNavigate()
    let [selected, setSelected] = useState([])

    let getReferrals = async () => {
        let data = (await (await fetch(`${apiHost}/referrals`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        console.log(data)
        if (data.status === "success" && data.data.length > 0) {
            for (let v of data.data) {
                v.createdAt = timeSince(new Date(v.createdAt)) + " ago"
                v.dob = timeSince(new Date(v.dob)) + " old"
            }
        }
        setReferrals(data.data)
        return
    }

    let previewReferral = async () => {
        if (selected.length === 1) {
            navigate(`/referral/${selected[0]}`)
            return
        }
        return
    }

    let deleteReferrals = async () => {

    }

    useEffect(() => {
        getReferrals()
    }, [])

    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/community-referrals")
            return
        }
    }, []);

    const columns = [
        { field: 'lastName', headerName: 'Last Name', width: 250, editable: true },
        { field: 'firstName', headerName: 'First Name', width: 250, editable: true },
        { field: 'dob', headerName: 'Age', width: 150 },
        { field: 'createdAt', headerName: 'Referral Time', width: 200 }
    ];

    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    // console.log(args)

    return (
        <>
            
                <br />
                <Container maxWidth="lg">
                    <br />
                    <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile ? "1em" : "2em", paddingRight: isMobile ? "1em" : "2em" }}>
                        <TextField type={"text"} size="small" sx={{ width: "80%" }} placeholder='Patient Name or Patient ID' />
                        <Button variant="contained" size='small' sx={{ width: "20%", backgroundColor: "#632165" }} disableElevation>Search</Button>
                    </Stack>
                    <br />
                    <Stack direction="row" spacing={2} alignContent="right" >
                        {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 0) ? '63%' : '73%' }}></Typography>}
                        {(selected.length > 0) &&
                            <>
                                <Button variant="contained" onClick={e => { "deleteUsers()" }} disableElevation sx={{ backgroundColor: 'red' }}>Delete Referral{(selected.length > 1) && `s`}</Button>                        </>
                        }
                        {(selected.length === 1) &&
                            <Button variant="contained" onClick={e => { previewReferral() }} disableElevation sx={{ backgroundColor: 'gray' }}>Preview Referral</Button>
                        }
                    </Stack>
                    <br />
                    <DataGrid
                        loading={(referrals && (referrals.length > 0)) ? false : (referrals.length === 0) ? false : true}
                        rows={referrals ? referrals : []}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        autoHeight
                        disableSelectionOnClick
                        onSelectionModelChange={e => { setSelected(e) }}
                        onCellEditStop={e => { console.log(e) }}
                    />
                </Container>
            
        </>
    )

}




