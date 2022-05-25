import express from "express";
import SwaggerUI from 'swagger-ui-express'

import swaggerDoc from '../swagger.json'
// https://levelup.gitconnected.com/how-to-add-swagger-ui-to-existing-node-js-and-express-js-project-2c8bad9364ce

const router = express.Router()

router.use('/', SwaggerUI.serve)
router.get('/', SwaggerUI.setup(swaggerDoc))




export default router