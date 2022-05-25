import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'

const router = express.Router()
router.use(express.json())


// Get User Information.
router.get("/", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let role = decodedSession.session.role
            if (role !== 'ADMINISTRATOR') {
                res.statusCode = 401
                res.send({ error: `Insufficient Permissions for ${role}`, status: "error" });
                return
            }
            let users = await db.user.findMany({
                select: {
                    id: true, names: true, email: true,
                    createdAt: true, updatedAt: true, username: true,
                    role: true
                }
            })
            res.statusCode = 200
            res.json({ status: "success", users })
            return
        }
    } catch (error) {
        console.error(error)
        res.statusCode = 400
        res.json(error)
        return
    }
});

// Modify User Details
router.get("/:id",[requireJWT], async (req: Request, res: Response) => {
    try {
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
        let user = await db.user.findFirst({
            where: {
                id: id
            }
        })
        let responseData = { id: user?.id, createdAt: user?.createdAt, updatedAt: user?.updatedAt, names: user?.names, email: user?.email, role: user?.role }
        res.statusCode = 201
        res.json({ user: responseData, status: "success" })
        return
    } catch (error: any) {
        res.statusCode = 400
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", message: `User with the ${error.meta.target} provided not found` });
            return
        }
        res.json(error)
        return
    }
});

// Modify User Details
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

export default router