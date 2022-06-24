import express, { NextFunction, Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { createEncounter, createObservation, createObservationValue } from "../lib/fhir/utils";
import fetch from 'cross-fetch'

const router = express.Router()

router.use(express.json())



router.post('/observations', async (req: Request, res: Response) => {

    try {
        let { observations, patientId, encounterId } = req.body

        let builtObservations: any[] = []
        for (let observation of observations) {
            //create observations
            let observationId = uuidv4()
            let ov = createObservationValue(observation.value, observation.type, observation.unit || "", observation.code)
            let o = createObservation(observation.code, patientId, ov, observationId, encounterId)
            let response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation/${observationId}`, {
                body: JSON.stringify(o),
                method: 'PUT',
                headers: { "Content-Type": "application/json" }
            })).json()
            console.log(response)
            console.log(o)
            builtObservations.push(response)
        }
        return
    } catch (error) {
        res.json({ error, status: "error" })
        return
    }

})


router.get('/observations', [], async (req: Request, res: Response) => {
    try {
        let { patientId, encounter } = req.query;
        let response;
        if (encounter) {
            response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation?encounter=${encounter}`)).json()
        }
        if (patientId) {
            response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation?patient=${patientId}`)).json()
        }
        if (!patientId && !encounter) {
            response = await (await fetch(`http://127.0.0.1:8080/fhir/Observation`)).json()
        }
        // console.log(response)
        res.json({ observations: response.entry || [], status: "success" })
        return
    } catch (error) {
        console.error(error)
        res.json({ error, status: "error" })
        return
    }
})

router.post('/encounters', [], async (req: Request, res: Response) => {
    try {
        // ?? if exists, update
        let { encounterType, patientId } = req.body;
        let encounterId = uuidv4();
        let encounter = createEncounter(patientId, encounterId, encounterType);
        let response = await (await fetch(`http://127.0.0.1:8080/fhir/Encounter/${encounterId}`, {
            body: JSON.stringify(encounter),
            method: 'PUT',
            headers: { "Content-Type": "application/json" }
        })).json()
        console.log(response)
        res.json({ "status": "success", "id": encounterId })
        return
    } catch (error) {
        res.json({ error, status: "error" })
        return
    }
})

router.get('/encounters', [], async (req: Request, res: Response) => {
    try {
        let { patientId } = req.query
        let response;
        if (patientId) {
            response = await (await fetch(`http://127.0.0.1:8080/fhir/Encounter?patient=${patientId}`)).json()
        }else{
            response = await (await fetch(`http://127.0.0.1:8080/fhir/Encounter`)).json()
        }
        // console.log(response)
        res.json({ encounters: response.entry, status: "success" })
        return
    } catch (error) {
        // console.log(error)
        res.json({ error, status: "error" })
        return
    }
})



export default router