import express from "express";
import { isTokenExpired } from "../lib/jwt";
import db from '../lib/prisma'

const router = express.Router()


// Generate Access Token
router.post("/oauth/token", async (req, res) => {
    let { name } = req.query;
    console.log(req.headers.authorization)


    // 
    
});

// Get User Information.
// router.get("/me", async (req, res) => {

//   if (!token || isTokenExpired(token)) {
//     res.statusCode = 401
//     res.send({ error: "Invalid access token" });
//     return
//   }

// });


// Login




// Password Reset 



export default router