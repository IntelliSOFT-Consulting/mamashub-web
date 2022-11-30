import express, { Request, Response } from "express";
import { FhirApi } from "../lib/utils";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import { parsePhoneNumber, sendSMS } from "../lib/sms";

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
                return;
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
        return;

    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({ error, status: "error" });
        return;
    }
})

// Get Facility Information.
router.get("/facilities", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1]);
        if (decodedSession.type === 'valid') {
            let role = decodedSession.session.role;
            if (role !== 'ADMINISTRATOR') {
                res.statusCode = 401;
                res.send({ error: `Insufficient Permissions for ${role}`, status: "error" });
                return;
            }
            let facilities = await db.facility.findMany({
                select: {
                    kmhflCode: true, name: true, data: true,
                    createdAt: true, updatedAt: true, disabled: true
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
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type === 'valid') {
            let currentRole = decodedSession.session.role;
            let userId = decodedSession.session.userId;
            if (currentRole !== 'ADMINISTRATOR') {
                res.statusCode = 401;
                res.send({ error: `Insufficient Permissions for ${currentRole}`, status: "error" });
                return;
            }
        }
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
});

// Edit Facility Details...
router.post("/facilities/:id", [requireJWT], async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        let { status, county, subCounty, ward } = req.body;
        console.log(req.body)
        console.log(status)
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type === 'valid') {
            let currentRole = decodedSession.session.role;
            let userId = decodedSession.session.userId;
            if (currentRole !== 'ADMINISTRATOR') {
                res.statusCode = 401;
                res.send({ error: `Insufficient Permissions for ${currentRole}`, status: "error" });
                return;
            }
        }
        let facility = await db.facility.update({
            where: { kmhflCode: id },
            data: {
                ...county && {
                    data: {
                        county, subCounty: subCounty || "", ward: ward || ""
                    }
                },
                ...status && { disabled: (status === "disabled") }
            }
        })
        // let responseData = { id: user.id, createdAt: user.createdAt, updatedAt: user.updatedAt, names: user.names, email: user.email, role: user.role }
        res.statusCode = 201;
        res.json({ facility: facility.kmhflCode, status: "success" });
        return;
    } catch (error: any) {
        res.statusCode = 400;
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", message: `User with the ${error.meta.target} provided already exists` });
            return
        }
        res.json(error);
        return;
    }
});



router.post('/x_admin_sms', async (req: Request, res: Response) => {
    try {
        let { patient, message } = req.body;
        console.log(req.body)
        let phone = await (await FhirApi({url:`/Patient/${patient}`})).data?.telecom[0].value || null
        if (!phone || !message) {
            res.json({ status: "error", message: "phone number and message are required." })
            return; 
        }
        phone = parsePhoneNumber(phone);
        if (!phone) {
            res.json({ status: "error", message: "invalid phone number provided" })
            return;
        }
        let response = await sendSMS(phone, message);
        console.log(response)
        res.json({ message: response.message ?? response.error, status: response.status })
    } catch (error) {
        console.log(error);
        res.json(error);
        return;
    }

})


export default router