import express, { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/prisma';
import { createEncounter, createObservation, createObservationValue, FhirApi, Patient } from "../lib/utils";
import fetch from 'cross-fetch';
import observationCodes from '../lib/observationCodes.json';
import { decodeSession, requireJWTMiddleware } from "../lib/jwt";

const router = express.Router();

router.use(express.json());

let codes: { [index: string]: string } = observationCodes.codes

router.post('/observations', async (req: Request, res: Response) => {
    try {
        let { observations, patientId, encounterId } = req.body
        console.log(observations, patientId, encounterId)
        if (!observations || !patientId || !encounterId) {
            res.json({ error: "observations, patientId and encounterId are required", status: "error" })
            return
        }
        let builtObservations: any[] = []
        for (let obs of Object.keys(observations)) {
            let _observation = observations[obs]
            //create observations
            console.log(_observation)
            console.log("Observation", _observation)

            let observationId = uuidv4();
            if (Object.keys(codes).indexOf(obs) > -1) {
                let metaData = codes[obs];
                let coding = {
                    system: metaData.split(":")[0], display: metaData.split(":")[2], code: metaData.split(":")[1]
                }

                // let ov = parseFloat(_observation) ? { valueQuantity: createObservationValue(_observation, metaData.split(":")[3] || "") } : { valueString: _observation }
                let ov = { valueString: _observation }
                console.log(obs)
                let o = createObservation(patientId, ov, coding, observationId, encounterId)
                // console.log(":observation", o)
                let response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation/${observationId}`, {
                    body: JSON.stringify(o),
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" }
                })).json()
                console.log(response)
                // console.log(o)
                builtObservations.push(response);
            }
            else {
                console.log({ error: `observation key for ${obs} not found`, status: "error" })
                // return
            }
        }
        res.json({ observations: builtObservations, status: "success" })
        return
    } catch (error) {
        console.log(error)
        res.json({ error: JSON.stringify(error), status: "error" })
        return
    }
})

router.get('/observations', [], async (req: Request, res: Response) => {
    try {
        let { patientId, encounter, count } = req.query;
        let response;
        if (encounter) {
            response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation?encounter=${encounter}&_count=${count ?? 50}`)).json()
        }
        if (patientId) {
            response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation?patient=${patientId}&_count=${count ?? 50}`)).json()
        }
        if (!patientId && !encounter) {
            response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation?_count=${count ?? 50}`)).json()
        }
        res.json({ observations: response.entry || [], status: "success" })
        return
    } catch (error) {
        console.log(error);
        res.json({ error: error, status: "error" });
        return;
    }
})

router.post('/encounters', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let { encounterCode, patientId, encounterType } = req.body;
        let encounterId = uuidv4();
        let encounter = createEncounter(patientId, encounterId, encounterType ?? 2, encounterCode);
        let response = await (await fetch(`http://127.0.0.1:8080/fhir/Encounter/${encounterId}`, {
            body: JSON.stringify(encounter),
            method: 'PUT',
            headers: { "Content-Type": "application/json" }
        })).json()
        // console.log(response)
        res.json({ status: "success", id: response.id, encounter: encounter })
        return;
    } catch (error) {
        res.json({ error, status: "error" });
        return
    }
})

router.get('/encounters', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let { patient, encounterCode, count } = req.query
        console.log(patient)
        let response = await (await fetch(`http://127.0.0.1:8080/fhir/Encounter?patient=${patient}${encounterCode ? `&reason-code=${encounterCode}` : ''}&_count=${count || 50}&_sort=date`)).json()
        console.log(response)
        res.json({ encounters: response.entry ?? [], status: "success" })
        return
    } catch (error) {
        res.json({ error, status: "error" })
        return
    }
})


// router.get('/')



router.get('/patients', [requireJWTMiddleware], async (req: Request, res: Response) => {
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
            let patients = await (await FhirApi({ url: `/Patient${user?.facilityKmhflCode && `?identifier=${user?.facilityKmhflCode}`}` })).data?.entry || [];
            // let patients = await (await FhirApi({ url: `/Patient?_count=1000` })).data?.entry || [];
            let _patients = [];
            for (let patient of patients) {
                console.log(patient);
                _patients.push({ ...patient.resource, text: null });
            }
            console.log(_patients.length);
            res.json({ patients: _patients, status: "success", count: _patients.length });
        }
        return
    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
})


//delete patient
router.delete('/patients/:id', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        let { id } = req.params;
        let response = await FhirApi({ url: `/Patient/${id}?_cascade=delete`, method: "DELETE" })
        console.log(response);
        res.json({ message: "Created patient successfully", status: "success" });
        return;

    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
})


//get single patient details
router.get('/patients/:id', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        let { id } = req.params;
        let response = await FhirApi({ url: `/Patient/${id}`, method: "GET" })
        console.log(response);
        res.json({ patient: response.data, status: "success", id });
        return;

    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
})


//create patient
router.post('/patients/:id', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        let { id } = req.params;
        let response = await FhirApi({ url: `/Patient/${id}`, method: "PUT", data: JSON.stringify(Patient(req.body)) })
        console.log(response);
        res.json({ message: "Created patient successfully", status: "success" });
        return;

    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
})

export default router