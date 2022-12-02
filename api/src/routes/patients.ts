import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import { getObservationFromEncounter } from "../lib/utils";

const router = express.Router()
router.use(express.json())

// Get User Information.
router.get("/", [requireJWT], async (req: Request, res: Response) => {
    try {
        let data = await db.patient.findMany()
        res.statusCode = 200
        res.json({ status: "success", data })
        return
    }
    catch (error) {
        console.error(error)
        res.statusCode = 400
        res.json(error)
        return
    }
});

// Modify User Details
router.get("/:id", [requireJWT], async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let patient = await db.patient.findUnique({
            where: {
                id: id
            }
        })
        res.statusCode = 201
        res.json({ status: "success", data: patient })
        return
    } catch (error: any) {
        res.statusCode = 400
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", message: `Patient with the ${error.meta.target} provided not found` });
            return
        }
        res.json(error)
        return
    }
});


// Modify Patient Details
router.post("/:id", [requireJWT], async (req: Request, res: Response) => {
    try {
        let data = req.body;
        let { id } = req.params
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let role = decodedSession.session.role
            let userId = decodedSession.session.userId
            if (role !== 'ADMINISTRATOR' || id !== userId) {
                res.statusCode = 401
                res.send({ error: `Insufficient Permissions for ${role}`, status: "error" });
                return
            }
        }
        let user = await db.user.update({
            where: {
                id: id
            },
            data: data
        })
        let responseData = { id: user.id, createdAt: user.createdAt, updatedAt: user.updatedAt, names: user.names, email: user.email, role: user.role }
        res.statusCode = 201
        res.json({ user: responseData, status: "success" })
        return
    } catch (error: any) {
        res.statusCode = 400
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", message: `User with the ${error.meta.target} provided already exists` });
            return
        }
        res.json(error)
        return
    }
});

// Modify User Details
router.get("/weight-monitoring/:id", [requireJWT], async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let gestationCode = "";
        let weight = "";
        
        let weightObservations = await getObservationFromEncounter(id, "PHYSICAL_EXAMINATION", weight);
        let gestationObservations = await getObservationFromEncounter(id, "PHYSICAL_EXAMINATION", gestationCode);
        res.statusCode = 201;
        res.json({ status: "success", data: [] })
        return
    } catch (error: any) {
        res.statusCode = 400
        console.error(error)
        res.json({ status: "error", error: JSON.stringify(error) });
        return

    }
});

export default router