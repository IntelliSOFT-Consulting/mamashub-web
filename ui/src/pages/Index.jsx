import { Typography, Stack, TextField, Button, Container, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from '../lib/cookie';

import { FhirApi } from './../lib/api'

export default function Index() {
    let [patients, setPatients] = useState()
    let navigate = useNavigate()
    let [selected, setSelected] = useState([])

    

    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    // console.log(args)

    return (
        <>
            <Layout>
                <br />
                <Container maxWidth="lg">
                <Stack direction="row" spacing={2} alignContent="right" >
                {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 0) ? '68%' : '78%' }}></Typography>}
                    {(selected.length === 1) &&
                        <>
                            <Button variant="contained" onClick={e=>{"deleteUsers()"}} disableElevation sx={{ backgroundColor: 'green' }}>View Patient</Button></>
                    }
                    {(selected.length === 1) && 
                        <Button variant="contained" disableElevation sx={{ backgroundColor: 'gray' }}>Start Visit</Button>
                    }
                </Stack>
                <br/>
                
                </Container>
            </Layout>
        </>
    )

}




