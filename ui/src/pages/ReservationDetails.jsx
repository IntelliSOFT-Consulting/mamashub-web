import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import { Container, Stack, useMediaQuery, Card, 
        Paper, Grid, Typography, LinearProgress, 
        Divider, Button, ButtonGroup 
} from '@mui/material'
// import Card


export default function ReservationDetails() {

    let { id } = useParams()
    let isMobile = useMediaQuery('(max-width:600px)');
    let [reservation, setReservation] = useState(null)


    let getReservation  = async () => {
        let data = (await (await fetch(`/api/method/fosa.api.reservations.get_one?id=${id}`,)).json())
        console.log(data)
        setReservation(data.reservation)
    }

    useEffect(() => {
        getReservation()
    }, [])



    return (<>

        <Header />
        <Container maxWidth="lg">

            {reservation ? <>
                {/* {JSON.stringify(reservation)} */}
                <br/>
                <Stack direction={isMobile ? "column": "row"} spacing="8">
                    <Paper sx={{minWidth:"50%", padding:"2em"}} elevation={0} >
                        <Container>
                            <img src={reservation.listing_info.image_1} alt={reservation.listing_info.name} style={{maxWidth: "100%"}} />
                            <Typography variant="h3">{reservation.listing_info.listing_name} - {reservation.listing_info.location}, {reservation.listing_info.city} </Typography>
                            <Typography variant="h5">Check In: {reservation.from_date}</Typography>
                            <Typography variant="h5">Check Out: {reservation.to_date}</Typography>
                            <Typography variant="h5">Duration of Stay: {reservation.duration}</Typography>
                            <Typography variant="h5">Reservation Status: {reservation.status}</Typography>
                            <Typography variant="h5">Reservation ID: {reservation.name}</Typography>
                        </Container>
                        <br/>
                        <Divider orientation="horizontal"/>
                        <Container>
                            <br/>
                            <Typography variant="h4">Listing Details</Typography>
                            <br/>
                            <Typography variant="p">
                                {reservation.listing_info.description}
                            </Typography>
                            <br/><br/>
                            <Typography variant="h4">Amenities</Typography>
                            <br/>
                            {/* <Typography variant="p">
                                {reservation.listing_info.description}
                            </Typography> */}
                            <br/><br/>
                            <Typography variant="h4">Listing Images</Typography>
                            <br/>
                            <Grid container spacing={2}>
                            {reservation.listing_info.image_1 && 
                                <Grid item xs={12} lg={4}>
                                <img src={reservation.listing_info.image_1} alt={reservation.listing_info.name} style={{maxWidth:"100%"}} />
                                </Grid>
                            }
                            {reservation.listing_info.image_2 && 
                                <Grid item xs={12} lg={4}>
                                <img src={reservation.listing_info.image_2} alt={reservation.listing_info.name} style={{maxWidth:"100%"}} />
                                </Grid>
                            }
                            {reservation.listing_info.image_3 && 
                                <Grid item xs={12} lg={4}>
                                <img src={reservation.listing_info.image_3} alt={reservation.listing_info.name} style={{maxWidth:"100%"}} />
                                </Grid>
                            }
                            {reservation.listing_info.image_4 && 
                                <Grid item xs={12} lg={4}>
                                <img src={reservation.listing_info.image_4} alt={reservation.listing_info.name} style={{maxWidth:"100%"}} />
                                </Grid>
                            }
                            {reservation.listing_info.image_5 && 
                                <Grid item xs={12} lg={4}>
                                <img src={reservation.listing_info.image_5} alt={reservation.listing_info.name} style={{maxWidth:"100%"}} />
                                </Grid>
                            }
                            </Grid>
                        </Container>

                    </Paper>
                </Stack>

            </> : <>
            <br/><br/><br/><br/>
             <LinearProgress color="inherit" />
             <Typography sx={{textAlign:"center"}} variant="h5">Loading Reservation Details</Typography>
            </>}
            {/* <br/>
            <Divider orientation="horizontal"/>
            <br /> */}
        </Container>

    </>)


}




