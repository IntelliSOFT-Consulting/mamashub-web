import {
    Card, CardContent, Button,
    CardMedia, Avatar, CardActions, Typography,  Stack
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function CurrentPatient({data}) {

    let navigate = useNavigate()

    return (
        <>
            <Card sx={{backgroundColor: "purple", color: "white" }}>
                <CardContent>
                    <Typography variant="p">Names: <b>{data.name} {`-----`}</b> {"Patient ID:"} <b>{data.id + "-----"}</b> Age: {data.age + " " }</Typography>
                    <Typography variant="p" onClick={e=>{navigate(`/patients/${data.id}`)}}> ---- [View Profile]</Typography>
                </CardContent>
            </Card>
        </>
    )
}




