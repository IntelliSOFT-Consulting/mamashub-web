import express, {NextFunction, Response, Request} from "express";
import { createProxyMiddleware, fixRequestBody} from 'http-proxy-middleware';
import { requireJWTMiddleware as requireJWT } from "../lib/jwt";

const router = express.Router()

router.use(express.json())

router.use(function (err:any, req: Request, res: Response, next: NextFunction) {
    console.error('Got an error!', err);
    res.end();
});


router.use('/', [requireJWT, createProxyMiddleware(
    {
        target: 'https://devhmis.intellisoftkenya.com', changeOrigin: true,
        pathRewrite: {
            '^/fhir/old-path': '/fhir/new-path',
        },
        onProxyReq: fixRequestBody
})]);




router.post('/observations', [requireJWT], async (req: Request, res: Response) => {

    let {observations, patientId} = req.body
    let builtObservations: any[]
    // for(let observation of observations){
    //     //create observations
    //     builtObservations.push(CreateObservation(
    //         code: observation.code.
    //         patientId: patientId,
    //         observationValue: observation.value,
    //         id = 
    //     ))
    // }

    //post observations

    // CreateObservation = (code = null, patientId = null, observationValue = null, id = null, encounterId = null) => {
    return
    
})


router.get('/observations/:id', [requireJWT], async (req: Request, res: Response) => {
    
    return
})

router.post('/encounters', [requireJWT], async (req: Request, res: Response) => {
    // if exists, update
    return
})

router.get('/encounters/:id', [requireJWT], async (req: Request, res: Response) => {
    // get encounter information + observations
    
    return    
})



export default router