import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'

const router = express.Router();
router.use(express.json());

// Get Dashboard Stats.
router.get("/dashboard", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let role = decodedSession.session.role
            let userId = decodedSession.session.userId
            if (!(role === 'ADMINISTRATOR' || role === "FACILITY_ADMINISTRATOR")) {
                res.statusCode = 401;
                res.send({ error: `Insufficient Permissions for ${role}`, status: "error" });
                return;
            }
            let user = await db.user.findUnique({
                where: {
                    id: userId
                }
            });
            let users = await db.user.count({
                where: {
                    ...(user?.facilityKmhflCode) && { facilityKmhflCode: user.facilityKmhflCode }
                }
            });
            let facilities = null;
            console.log(role)
            if (role === 'ADMINISTRATOR') {
                facilities = await db.facility.count();
                console.log(facilities)
            }
            res.statusCode = 200;
            // res.setHeader('Date', new Date().toString());
            // res.append('Expires', new Date(new Date().setMinutes(new Date().getMinutes() + 3)).toISOString())
            res.json({ status: "success", data: { users, ...(role === 'ADMINISTRATOR') && { facilities: facilities } } });
            return;
        }
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json(error);
        return
    }
});

export default router
