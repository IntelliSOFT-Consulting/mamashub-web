import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router()

router.get('/', async (req, res) => {

    res.send({hey:"Amolo"})
})

export default router