import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import * as bcrypt from 'bcrypt'

const router = express.Router();
router.use(express.json());



// Add Facility
router.post('/facilities', [requireJWT], async (req: Request, res: Response) => {
    try {
        let data = req.body;
        console.log(data);
        let fields = ['kmhflCode', 'name', 'county'];
        for (let f of fields) {
            if (Object.keys(data).indexOf(f) < 0) {
                res.statusCode = 400;
                res.json({ error: `${f} is a required field`, status: "error" });
                return
            }
        }
        let facility = await db.facility.create({
            data: {
                name: data.name,
                kmhflCode: data.kmhflCode,
                data: {
                    county: data.county, subCounty: data.subCounty, ward: data.ward ?? "", street: data.street ?? ""
                }
            }
        });
        res.statusCode = 200;
        res.json({ message: "Facility created successfully", status: "success", id: facility.kmhflCode });
        return

    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({ error, status: "error" });
        return
    }
})

// Get Facility Information.
router.get("/facilities", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1]);
        if (decodedSession.type == 'valid') {
            let role = decodedSession.session.role
            if (role !== 'ADMINISTRATOR') {
                res.statusCode = 401;
                res.send({ error: `Insufficient Permissions for ${role}`, status: "error" });
                return
            }
            let facilities = await db.facility.findMany({
                select: {
                    kmhflCode: true, name: true, data: true,
                    createdAt: true, updatedAt: true
                },
            });
            res.statusCode = 200;
            res.json({
                status: "success", facilities: facilities.map((facility) => {
                    let data: any = facility.data;
                    return {
                        ...facility, county: data.county || "", subCounty: data.subCounty || "", ward: data.ward || ""
                    }
                })
            });
            return;
        }
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json(error);
        return;
    }
});

// Get User Information.
router.delete("/facilities/:id", [requireJWT], async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let response = await db.facility.delete({
            where: {
                kmhflCode: id
            }
        })
        res.statusCode = 200;
        res.json({ status: "success", "id": id })
        return;

    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json(error);
        return;
    }
})

// Edit Facility Details...
export default router