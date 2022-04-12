import { useState, useEffect } from 'react'
import {
    Card, CardContent, Button,
    CardMedia, Avatar, CardActions, Typography,  Stack
} from '@mui/material'
import { borderBottom } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import LocationOn from '@mui/icons-material/LocationOn';

export default function Listing({ data }) {

    let navigate = useNavigate()

    return (
        <>
            <Card sx={{ maxWidth: "400px", backgroundColor: "purple", color: "white" }}>
                <CardMedia component="img"
                    height="200"
                    image={data.image_1} />
                <CardContent sx={{ borderBottom: 1 }}>
                    <h4 style={{float:"right", backgroundColor:"white", color: "black",padding:".3em", borderRadius:"10px"}}>KES {data.price}</h4>
                    <Typography variant="h5" component="div">
                        {data.listing_name} 
                    </Typography>
                    
                    <Stack direction="row">
                    <LocationOn sx={{p:".1em"}}/> 
                    <Typography variant="p" sx={{p:".35em"}} noWrap color="white">
                         {data.location} - {data.city}
                    </Typography>
                    </Stack>
                    
                    <br/>
                    <Typography variant="body2" color="white">
                        {(data.description.length > 200) ? (data.description).substring(0, 220) : data.description }
                    </Typography>

                </CardContent>
                <CardActions>
                    <Button size="small" variant="filled" onClick={e => {
                        navigate(`/listing/${data.name}`)
                    }}>View</Button>
                    <Button size="small" variant="filled">Share</Button>
                </CardActions>
            </Card>
        </>
    )
}




