import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import * as bcrypt from 'bcrypt'
import { sendPasswordResetEmail, validateEmail, sendWelcomeEmail } from "../lib/email";

const router = express.Router()
router.use(express.json())



// Get patient Information.
router.get("/me", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401
            res.json({ error: "Invalid access token", status: "error" });
            return
        }
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        // console.log(decodedSession)
        if (decodedSession.type == 'valid') {
            let patientId = decodedSession.session.userId
            let patient = await db.patient.findFirst({
                where: {
                    id: patientId
                }
            })
            let responseData = { id: patient?.id, createdAt: patient?.createdAt, updatedAt: patient?.updatedAt, names: patient?.names, email: patient?.email }
            res.statusCode = 200
            res.json({ data: responseData, status: "success" })
            return
        }
    } catch (error) {
        // console.log(error)
        res.statusCode = 400
        res.json({ status: "error", error: error })
        return
    }
});


// Login
router.post("/login", async (req: Request, res: Response) => {
    try {
        let newpatient = false
        let { email, patientname, password } = req.body;
        if (!validateEmail(email)) {
            res.statusCode = 400
            res.json({ status: "error", message: "invalid email value provided" })
            return
        }
        if (!email && !password && !email) {
            res.statusCode = 400
            res.json({ status: "error", message: "email or patientname  and password are required to login" })
            return
        }
        let patient = await db.patient.findFirst({
            where: {
                ...(email) && { email },
                ...(patientname) && { patientname }
            }
        })

        if (!patient) {
            res.statusCode = 401
            res.json({ status: "error", message: "Incorrect patientname/password or password provided." })
            return
        }

        if (patient?.verified !== true) {
            // console.log(patient)
            res.statusCode = 401
            res.json({ status: "error", message: "Kindly complete password reset or verify your account to proceed. Check reset instructions in your email." })
            return
        }
        const validPassword = await bcrypt.compare(password, patient?.password as string);
        if (validPassword) {
            let session = encodeSession(process.env['SECRET_KEY'] as string, {
                createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
                userId: patient?.id as string,
            })
            let patientData: any = patient?.data
            if (patientData.newpatient === true) {
                newpatient = true
                await db.patient.update({
                    where: {
                        ...(email) && { email },
                        ...(patientname) && { patientname }
                    },
                    data: {
                        data: { ...patientData, newpatient: false }
                    }
                })
            }
            res.json({ status: "success", token: session.token, issued: session.issued, expires: session.expires, newpatient })
            return
        } else {
            res.statusCode = 401
            res.json({ status: "error", message: "Incorrect patientname/password or password provided" })
            return
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.json({ error: "incorrect email or password" });
        return
    }
});


// Register patient
router.post("/register", async (req: Request, res: Response) => {
    try {
        let { email, idNumber, names, password } = req.body;
        if (!validateEmail(email)) {
            res.statusCode = 400
            res.json({ status: "error", message: "invalid email value provided" })
            return
        }
        if (!password) {
            password = (Math.random()).toString()
        }
        
        let salt = await bcrypt.genSalt(10)
        let _password = await bcrypt.hash(password, salt)
        let patient = await db.patient.create({
            data: {
                email, names, salt: salt, password: _password, idNumber,
            }
        })
        let patientId = patient.id
        let session = encodeSession(process.env['SECRET_KEY'] as string, {
            createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
            userId: patient?.id as string,
            role: "RESET_TOKEN"
        })
        patient = await db.patient.update({
            where: {
                id: patientId
            },
            data: {
                resetToken: session.token,
                resetTokenExpiresAt: new Date(session.expires)
            }
        })
        let resetUrl = `${process.env['WEB_URL']}/new-password?id=${patient?.id}&token=${patient?.resetToken}`
        let response = await sendWelcomeEmail(patient, resetUrl)
        console.log("Email API Response: ", response)
        let responseData = { id: patient.id, createdAt: patient.createdAt, updatedAt: patient.updatedAt, names: patient.names, email: patient.email }
        res.statusCode = 201
        res.json({ patient: responseData, status: "success", message: `Password reset instructions have been sent to your email, ${patient?.email}` })
        return
    } catch (error: any) {
        res.statusCode = 400
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", error: `patient with the ${error.meta.target} provided already exists` });
            return
        }
        res.json(error)
        return
    }
});


// Register
router.post("/reset-password", async (req: Request, res: Response) => {
    try {
        let { patientname, email, id } = req.body;
        if (email && !validateEmail(email)) {
            res.statusCode = 400
            res.json({ status: "error", message: "invalid email value provided" })
            return
        }
        // Initiate password reset.
        let patient = await db.patient.findFirst({
            where: {
                ...(email) && { email },
                ...(patientname) && { patientname },
                ...(id) && { id }
            }
        })

        let session = encodeSession(process.env['SECRET_KEY'] as string, {
            createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
            userId: patient?.id as string,
            role: "RESET_TOKEN"
        })
        patient = await db.patient.update({
            where: {
                ...(email) && { email },
                ...(patientname) && { patientname },
                ...(id) && { id }
            },
            data: {
                resetToken: session.token,
                verified: false,
                resetTokenExpiresAt: new Date(session.expires)
            }
        })
        res.statusCode = 200
        let resetUrl = `${process.env['WEB_URL']}/new-password?id=${patient?.id}&token=${patient?.resetToken}`
        console.log(resetUrl)
        let response = await sendPasswordResetEmail(patient, resetUrl)
        console.log(response)
        res.json({ message: `Password reset instructions have been sent to your email, ${patient?.email}`, status: "success", });
        return

    } catch (error: any) {
        console.log(error)
        res.statusCode = 401
        if (error.code === 'P2025') {
            res.json({ error: `Password reset instructions have been sent to your email`, status: "error" });
            return
        }
        res.json({ error: error, status: "error" });
        return
    }
});

// Set New Password
router.post("/new-password", [requireJWT], async (req: Request, res: Response) => {
    try {
        let { password, id } = req.body;
        let patient = await db.patient.findFirst({
            where: {
                id: id as string
            }
        })
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(" ")[1] as string)
        if ((decodedSession.type !== 'valid') || !(patient?.resetToken) || ((patient?.resetTokenExpiresAt as Date) < new Date())
            || (decodedSession.session?.role !== 'RESET_TOKEN')
        ) {
            res.statusCode = 401
            res.json({ error: `Invalid and/or expired password reset token. Code: ${decodedSession.type}`, status: "error" });
            return
        }
        let salt = await bcrypt.genSalt(10)
        let _password = await bcrypt.hash(password, salt)
        let response = await db.patient.update({
            where: {
                id: id as string
            },
            data: {
                password: _password, salt: salt, resetToken: null, resetTokenExpiresAt: null, verified: true
            }
        })
        console.log(response)
        res.statusCode = 200
        res.json({ message: "Password Reset Successfully", status: "success" });
        return
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.json({ error: error, status: "error" });
        return
    }

});


// Delete patient
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        let patient = await db.patient.delete({
            where: {
                id: id
            }
        })
        let responseData = patient
        res.statusCode = 201
        res.json({ patient: responseData, status: "success" })
        return
    } catch (error: any) {
        res.statusCode = 400
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", error: `patient with the ${error.meta.target} provided already exists` });
            return
        }
        res.json(error)
        return
    }
});



export default router