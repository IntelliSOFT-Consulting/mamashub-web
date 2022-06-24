import express, { NextFunction, Response, Request } from "express";
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { requireJWTMiddleware as requireJWT } from "../lib/jwt";
import { v4 as uuidv4 } from 'uuid';
import { createEncounter, createObservation, createObservationValue } from "../lib/fhir/utils";
import fetch from 'cross-fetch'
import { type } from "os";

const router = express.Router()

router.use(express.json())

router.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Got an error!', err);
    res.end();
});

router.use('/', [createProxyMiddleware(
    {
        target: 'https://devhmis.intellisoftkenya.com', changeOrigin: true,
        pathRewrite: {
            '^/fhir/old-path': '/fhir/new-path',
        },
        onProxyReq: fixRequestBody
    })]);





export default router