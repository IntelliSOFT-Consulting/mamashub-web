import express, { NextFunction, Response, Request } from "express";
import { FhirApi } from "../lib/fhir/utils";
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";
import { generateGeneralReport } from "../lib/reports";


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
        let patientIds: any = []
        let patients = await (await FhirApi({ url: '/Patient?_limit=100' })).data
        patients = patients?.entry || []
        patients.map((patient: any) => {
            patientIds.push(patient.resource.id)
        })
        for (let id of patientIds) {
            report.push(await generateGeneralReport(id))
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




export default router