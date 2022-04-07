import express from "express";
import * as SwaggerUI from 'swagger-ui-express'

import swaggerDoc from './../swagger.json' 

const router = express.Router()

router.use('/', SwaggerUI.serve)
router.get('/', SwaggerUI.setup(swaggerDoc))

export default router