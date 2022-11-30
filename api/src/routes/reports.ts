import express, { NextFunction, Response, Request } from "express";
import { FhirApi } from "../lib/utils";
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";
import { generateANCSummary, generateGeneralReport, generateMOH711Report } from "../lib/reports";

const router = express.Router()

router.use(express.json())

router.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Got an error!', err);
    res.end();
});

router.get('/general', async (req: Request, res: Response) => {
    try {
        res.statusCode = 200
        let report = []
        let { from, to } = req.params
        let patientIds: any = []
        let patients = await (await FhirApi({ url: '/Patient?_count=99999' })).data
        patients = patients?.entry || []
        patients.map((patient: any) => {
            patientIds.push(patient.resource.id)
        })
        let today = new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0).toLocaleString()
        for (let id of patientIds) {
            report.push(await generateGeneralReport(id, from || null, to || null))
        }
        res.json({ report, status: "success" })
        return
    } catch (error) {
        console.error(error)
        res.statusCode = 400
        res.json({ error, status: "error" })
        return
    }
})

router.get('/moh-711', async (req: Request, res: Response) => {
    try {
        res.statusCode = 200;
        let report = (await generateMOH711Report());
        res.json({ report, status: "success" });
        return
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({ error, status: "error" });
        return
    }
});

router.get('/anc-summary', async (req: Request, res: Response) => {

    try {
        res.statusCode = 200;
        let report = (await generateANCSummary());
        res.json({ report, status: "success" });
        return;
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({ error, status: "error" });
        return;
    }
})


export default router