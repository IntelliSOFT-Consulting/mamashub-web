// This file contains code used to link the Provider Facing Application with Mama's Hub Client App

import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import * as bcrypt from 'bcrypt'
import { sendPasswordResetEmail, validateEmail, sendWelcomeEmail } from "../lib/email";
import { getObservationFromEncounter, getPatientByIdentifier } from "../lib/utils";
import { generateOTP, parsePhoneNumber, verifyOTP } from "../lib/sms";

const router = express.Router();
router.use(express.json());



// Get patient Information.
router.get("/me", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401;
            res.json({ error: "Invalid access token", status: "error" });
            return;
        }
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        // console.log(decodedSession)
        if (decodedSession.type == 'valid') {
            let patientId = decodedSession.session.userId;
            let patient = await db.patient.findFirst({ where: { id: patientId } });
            let responseData = { id: patient?.id, createdAt: patient?.createdAt, updatedAt: patient?.updatedAt, names: patient?.names, idNumber: patient?.idNumber, fhirPatientId: patient?.patientId }
            res.statusCode = 200;
            res.json({ data: responseData, status: "success" });
            return;
        }
    } catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});


// Login
router.post("/login", async (req: Request, res: Response) => {
    try {
        let newUser = false
        let { idNumber, password } = req.body;

        if (!idNumber || !password) {
            res.statusCode = 401;
            res.json({ status: "error", error: "ID Number and password are required to login" })
            return;
        }

        let patient = await db.patient.findUnique({ where: { idNumber } });

        if (!patient) {
            res.statusCode = 401;
            res.json({ status: "error", error: "Invalid ID Number or password provided." });
            return
        }

        if (patient?.verified !== true) {
            // console.log(patient)
            res.statusCode = 401
            res.json({ status: "error", error: "Kindly complete account registration first." })
            return
        }
        const validPassword = await bcrypt.compare(password, patient?.password as string);
        if (validPassword) {
            // proceed with registration
            let fhirPatient = await getPatientByIdentifier(null, idNumber);
            if (!(fhirPatient)) {
                res.statusCode = 400;
                res.json({ status: "error", error: `Invalid credentials. Ensure client is registered on Mama's Hub` });
                return
            }

            let phoneNumber = fhirPatient.telecom[0].value || ''
            let p = await db.patient.update({
                where: { idNumber: idNumber },
                data: { names: fhirPatient.name[0].family, idNumber, phone: parsePhoneNumber(phoneNumber) || '', patientId: fhirPatient.id }
            })

            let session = encodeSession(process.env['SECRET_KEY'] as string, {
                createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
                userId: patient?.id as string,
            })
            let patientData: any = p?.data
            if (patientData.newUser === true) {
                newUser = true
                await db.patient.update({
                    where: { idNumber: idNumber },
                    data: { data: { ...patientData, newUser: false } }
                })
            }
            res.json({ status: "success", token: session.token, issued: session.issued, expires: session.expires, newUser })
            return
        } else {
            res.statusCode = 401
            res.json({ status: "error", error: "Incorrect ID Number or password provided" })
            return
        }
    } catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json({ error: "Invalid login credentials provided", status: "error" });
        return
    }
});


// Register patient
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { idNumber, phone } = req.body;
        if (!parsePhoneNumber(phone)) {
            res.statusCode = 400;
            res.json({ error: "Invalid phone number provided", status: "error" });
            return
        }
        // check if client is registered
        let patient = await db.patient.findFirst({ where: { idNumber, phone } })
        if (patient) {
            res.statusCode = 400
            res.json({ status: "error", error: `Client already registered` });
            return
        }

        // proceed with registration
        let fhirPatient = await getPatientByIdentifier(null, idNumber);
        if (!(fhirPatient)) {
            res.statusCode = 400;
            res.json({ status: "error", error: `Invalid credentials. Ensure client is registered on Mama's Hub` });
            return
        }

        let phoneNumber = fhirPatient.telecom[0].value || ''
        if (parsePhoneNumber(phoneNumber) !== parsePhoneNumber(phone)) {
            res.statusCode = 400
            res.json({ status: "error", error: `Invalid credentials. Ensure client is registered on Mama's Hub` });
            return
        }

        let p = await db.patient.create({ data: { names: fhirPatient.name[0].family, idNumber, phone: parsePhoneNumber(phone) || '', patientId: fhirPatient.id } })
        let responseData = { id: p.id }
        res.statusCode = 201
        res.json({ patient: responseData, status: "success", message: `Account created successfully` })
        return
    } catch (error: any) {
        res.statusCode = 400;
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", error: `You are already registered. Proceed to login.` });
            return
        }
        res.json(error);
        return
    }
});


// Register
router.post("/reset-password", async (req: Request, res: Response) => {
    try {
        let { phone, idNumber } = req.body;
        // Initiate password reset.
        if (!parsePhoneNumber(phone)) {
            res.statusCode = 400;
            res.json({ error: "Invalid phone number provided", status: "error" });
            return
        }
        let otpResponse = await generateOTP(parsePhoneNumber(phone) || phone, idNumber)
        console.log(otpResponse);
        if (otpResponse.status === "error") {
            res.statusCode = 400
            res.json(otpResponse);
            return
        }
        res.statusCode = 200
        res.json({ message: `OTP was successfully sent to ${phone}.`, status: "success", otp: otpResponse.otp });
        return

    } catch (error: any) {
        console.log(error)
        res.statusCode = 401;
        if (error.code === 'P2025') {
            res.json({ error: `Error while sending OTP. Check credentials and try again.`, status: "error" });
            return
        }
        res.json({ error: error, status: "error" });
        return
    }
});

// Set New Password
router.post("/new-password", async (req: Request, res: Response) => {
    try {
        let { password, idNumber, phone, otp } = req.body;
        let patient = await db.patient.findFirst({
            where: {
                ...(idNumber) && { idNumber }, ...(phone) && { phone }, otp
            }
        });
        let otpValidation = await verifyOTP(phone, otp);
        if (otpValidation.status !== "success") {
            res.json(otpValidation)
            return
        }
        if (!patient) {
            res.statusCode = 401;
            res.json({ error: `Invalid client credentials provided`, status: "error" })
            return;
        }
        let salt = await bcrypt.genSalt(10);
        let _password = await bcrypt.hash(password, salt);
        let response = await db.patient.update({
            where: {
                id: patient.id
            },
            data: {
                password: _password, verified: true
            }
        });
        console.log(response);
        res.statusCode = 200;
        res.json({ message: "Password Reset Successfully", status: "success" });
        return
    } catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json({ error: error, status: "error" });
        return
    }
});


// Delete patient
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        let patient = await db.patient.delete({ where: { id: id } });
        let responseData = patient;
        res.statusCode = 201;
        res.json({ patient: responseData, status: "success" });
        return;

    } catch (error: any) {
        res.statusCode = 400;
        console.error(error);
        if (error.code === 'P2002') {
            res.json({ status: "error", error: `patient with the ${error.meta.target} provided already exists` });
            return;
        }
        res.json(error);
        return
    }
});


router.get("/bp/:patientId", [requireJWT], async (req: Request, res: Response) => {
    try {
        let { patientId } = req.params;
        let observations = getObservationFromEncounter(patientId, "", "")
        let patient = await db.patient.delete({ where: { id: patientId } });
        let responseData = patient;
        res.statusCode = 201;
        res.json({ patient: responseData, status: "success" });
        return;
    } catch (error: any) {
        res.statusCode = 400;
        console.error(error);
        if (error.code === 'P2002') {
            res.json({ status: "error", error: `patient with the ${error.meta.target} provided already exists` });
            return;
        }
        res.json(error);
        return
    }
})


export default router