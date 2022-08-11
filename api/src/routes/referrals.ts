import express, { NextFunction, Response, Request } from "express";
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'


const router = express.Router()

router.use(express.json())


router.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Got an error!', err);
    res.end();
});


router.post('/', [requireJWT], async (req: Request, res: Response) => {

    try {
        let data = req.body
        let fields = ['phone', 'firstName', 'lastName', 'reasonsForReferral', 'mainProblems', 'sex', 'dob', 'county', 'subCounty', 'ward']
        for (let f of fields) {
            if (Object.keys(data).indexOf(f) < 0) {
                res.statusCode = 400
                res.json({ error: `${f} is a required field`, status: "error" })
                return
            }
        }
        let referral = await db.referral.create({
            data: {
                firstName: data.firstName, lastName: data.lastName,
                data: {
                    treatmentGiven: data.treatmentGiven || "N/A", reasonsForReferral: data.reasonsForReferral || "N/A",
                    mainProblems: data.mainProblems || "N/A",
                    comments: data.comments || "N/A"
                },
                sex: data.sex || "Female",
                dob: data.dob,
                phone: data.phone,
                residence: {
                    county: data.county, subCounty: data.subCounty, ward: data.ward, street: data.street || "N/A"
                }
            }
        })
        res.statusCode = 200
        res.json({ message: "Referral created successfully", status: "success", id: referral.id })
        return

    } catch (error) {
        console.error(error)
        res.statusCode = 400
        res.json({ error, status: "error" })
        return
    }

    return
})


router.get('/', [requireJWT], async (req: Request, res: Response) => {
    try {
        let referrals = await db.referral.findMany({
            orderBy: {
                createdAt: "asc"
            }
        })
        res.statusCode = 200
        res.json({ data: referrals, status: "success" })
        return
    } catch (error) {
        res.statusCode = 400
        res.json({ error, status: "error" })
        return
    }
})

router.get('/:id', [requireJWT], async (req: Request, res: Response) => {
    try {
        let { id } = req.params
        let referral = await db.referral.findUnique({
            where:{
                id: id
            }
        })
        res.statusCode = 200
        res.json({ data: referral, status: "success" })
        return
    } catch (error) {
        res.statusCode = 400
        res.json({ error, status: "error" })
        return
    }
})

// router.put('/:id', [requireJWT], async (req: Request, res: Response) => {

//     let { id } = req.params


//     return
// })


export default router