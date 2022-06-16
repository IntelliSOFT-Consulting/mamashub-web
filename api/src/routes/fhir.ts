import express, {NextFunction, Response, Request} from "express";
import { createProxyMiddleware, fixRequestBody} from 'http-proxy-middleware';
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";

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


router.post('/referrals', [requireJWT], async(req: Request, res: Response) => {


    let data = req.body

    return
})


router.get('/referrals', [requireJWT], async(req: Request, res: Response) => {

    let data = req.body

    return
})

router.get('/referrals/:id', [requireJWT], async(req: Request, res: Response) => {

    let data = req.body

    return
})


router.post('/createObservations', [requireJWT], async (req: Request, res: Response) => {

    let observations = req.body
    


    return
    
})


export default router