import express, { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { createEncounter, createObservation, createObservationValue } from "../lib/fhir/utils";
import fetch from 'cross-fetch';
import observationCodes from '../lib/fhir/observationCode.json';
import { requireJWTMiddleware } from "../lib/jwt";

const router = express.Router()

router.use(express.json())

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
            console.log(obs)
            let _observation = observations[obs]
            //create observations
            console.log(_observation)
            console.log("Observation", _observation)

            let observationId = uuidv4()
            if (Object.keys(codes).indexOf(obs) > -1) {

                let metaData = codes[obs]
                let coding = {
                    system: metaData.split(":")[0], display: metaData.split(":")[2], code: metaData.split(":")[1]
                }

                let ov = parseFloat(_observation) ? { valueQuantity: createObservationValue(_observation, metaData.split(":")[3] || "") } : { valueString: _observation }
                console.log(ov)
                let o = createObservation(patientId, ov, coding, observationId, encounterId)
                console.log(":observation", o)
                let response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation/${observationId}`, {
                    body: JSON.stringify(o),
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" }
                })).json()
                console.log(response)
                console.log(o)
                builtObservations.push(response)
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
        console.log(error)
        res.json({ error: error, status: "error" })
        return
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
        return
    } catch (error) {
        res.json({ error, status: "error" })
        return
    }
})

router.get('/encounters', [], async (req: Request, res: Response) => {
    try {
        let { patient, encounterCode, count } = req.query
        console.log(patient)
        let response = await (await fetch(`http://127.0.0.1:8080/fhir/Encounter?patient=${patient}${encounterCode ? `&reason-code=${encounterCode}` : ''}&_count=${count || 50}&_sort=-date`)).json()
        console.log(response)
        res.json({ encounters: response.entry ?? [], status: "success" })
        return
    } catch (error) {
        res.json({ error, status: "error" })
        return
    }
})

export default router