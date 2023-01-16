import express, { NextFunction, Response, Request } from "express";
import { FhirApi } from "../lib/utils";
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";
import { generateANCSummary, generateMOH405Report, generateMOH711Report } from "../lib/reports";
import db from '../lib/prisma';

const router = express.Router();

router.use(express.json());

router.get('/moh-405', [requireJWT], async (req: Request, res: Response) => {
    try {
        res.statusCode = 200;
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401;
            res.json({ error: "Invalid access token", status: "error" });
            return;
        }
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1]);
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId
            let user = await db.user.findFirst({
                where: {
                    id: userId
                }
            });
            let { from, to } = req.params


            let report: any = await generateMOH405Report(user?.facilityKmhflCode || '',
                from ? new Date(from) : new Date(new Date().setFullYear(2000)),
                to ? new Date(to) : new Date());
            // console.log("Report", report)

            // res.append('Expires', new Date(new Date().setMinutes(new Date().getMinutes() + 3)).toISOString());
            res.json({ report: report.report, status: "success" });
            return;
        }
        res.statusCode = 401;
        res.json({ error: "Invalid access token", status: "error" });
        return;
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({ error, status: "error" });
        return;
    }
})

router.get('/moh-711', [requireJWT], async (req: Request, res: Response) => {
    try {
        res.statusCode = 200;
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401;
            res.json({ error: "Invalid access token", status: "error" });
            return;
        }
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1]);
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId
            let user = await db.user.findFirst({
                where: {
                    id: userId
                }
            });
            let { from, to } = req.query;
            let report = (await generateMOH711Report(user?.facilityKmhflCode || null, String(from), String(to)));
            let today = new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0).toLocaleString()
            res.append('Expires', new Date(new Date().setMinutes(new Date().getMinutes() + 3)).toISOString())
            res.json({ report, status: "success" });
            return
        }
        res.statusCode = 401;
        res.json({ error: "Invalid access token", status: "error" });
        return;
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({ error, status: "error" });
        return
    }
});

router.get('/anc-summary', [requireJWT], async (req: Request, res: Response) => {

    try {
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401;
            res.json({ error: "Invalid access token", status: "error" });
            return;
        }
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1]);
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId
            let user = await db.user.findFirst({
                where: {
                    id: userId
                }
            });

            let { from, to } = req.params;
            let patientIds: any = [];
            let patients = await (await FhirApi({ url: `/Patient${user?.facilityKmhflCode && `?identifier=${user?.facilityKmhflCode}`}` })).data?.entry || [];
            patients.map((patient: any) => {
                patientIds.push(patient.resource.id);
            })
            // console.log(user?.facilityKmhflCode)
            let today = new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0).toLocaleString()
            let report = (await generateANCSummary(user?.facilityKmhflCode || ''));
            res.statusCode = 200;
            res.json({ report, status: "success" });
            return
        }
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({ error, status: "error" });
        return;
    }
})


export default router