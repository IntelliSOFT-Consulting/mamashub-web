import express from "express";
import SwaggerUI from 'swagger-ui-express'
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";

import swaggerDoc from '../swagger.json'
// https://levelup.gitconnected.com/how-to-add-swagger-ui-to-existing-node-js-and-express-js-project-2c8bad9364ce

const router = express.Router()

router.use('/', SwaggerUI.serve)
router.get('/', SwaggerUI.setup(swaggerDoc))


router.use('/fhir', [requireJWT, createProxyMiddleware(
    {
        target: 'https://devhmis.intellisoftkenya.com', changeOrigin: true,
        pathRewrite: {
            '^/fhir/old-path': '/fhir/new-path',
        }
    })]);




export default router