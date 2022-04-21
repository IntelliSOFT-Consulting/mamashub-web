import { TableBody, Table, Paper, Stack, TextField, Button, TableCell, Snackbar, TableRow, TableContainer, TableHead, Container , useMediaQuery} from '@mui/material'
import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function PatientList() {

    let [password, setPassword] = useState({})
    let [confirmPassword, setConfirmPassword] = useState({})
    let isMobile = useMediaQuery('(max-width:600px)');
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    let args = qs.parse(window.location.search);
    // console.log(args)

    let setNewPassword = async () => {
        setOpen(false)
        if (confirmPassword !== password) {
            setMessage("Passwords must match")
            setOpen(true)
            return
        }
        let data = (await (await fetch(`/auth/new-password`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${args.token}` },
                body: JSON.stringify({ id: args.id, password: password })
            }
        )).json())
        console.log(data)
        setOpen(false)
        if (data.status === "error") {
            setMessage(data.error)
            setOpen(true)
            return
        }
        else {
            setMessage(data.message)
            setOpen(true)
            setTimeout(() => {
                navigate('/login')
            }, 3000);
            return
        }

    }
    return (
        <>
            <Layout>
                <br />
                <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile? "1em":"2em", paddingRight: isMobile? "1em":"2em" }}>
                    <TextField type={"text"} size="small" sx={{ width: "90%" }} placeholder='Patient Name or Patient ID' />
                    <Button variant="contained" size='small' disableElevation>Search</Button>
                </Stack>
                <br/><br />
                <Container maxWidth="lg">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Patient Name</TableCell>
                                    <TableCell align="right">D.O.B</TableCell>
                                    <TableCell align="right">Patient ID</TableCell>
                                    <TableCell align="right">Place of birth</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.calories}</TableCell>
                                        <TableCell align="right">{row.fat}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.protein}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Layout>
        </>
    )

}




