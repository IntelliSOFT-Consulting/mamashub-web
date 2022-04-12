import express, {Request, Response} from "express";
import { requireJWTMiddleware as requireJWT } from "../lib/jwt";
import db from '../lib/prisma'

const router = express.Router()


// Generate Access Token
router.post("/token", async (req, res) => {
    let { name } = req.query;
    console.log(req.headers.authorization)


    // 

});

// Get User Information.
router.get("/me", [requireJWT], async (req: Request, res: Response) => {
    let token = req.headers.authorization || null;

    if (!token) {
        res.statusCode = 401
        res.send({ error: "invalid access token" });
        return
    }

});


// Login
router.post("/login", async (req: Request, res: Response) => {
    try {
        let { email, password } = req.body;
        let user = db.user.findFirst({
            where: {
                email: email
            }
        })

    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.send({ error: "incorrect email or password" });
        return
    }



    
    res.statusCode = 401
    res.send({ error: "incorrect email or password" });
    return

});


// Register User
router.post("/register", async (req: Request, res: Response) => {
    try {
        let { email, password, username, names } = req.body;
        let user = await db.user.create({
            data:{
                email, password, names, username, role: 'STAFF'
            }
        })
        let responseData = {id:user.id, createdAt:user.createdAt, updatedAt: user.updatedAt, names:user.names, email: user.email, role: user.role}
        res.statusCode = 201
        res.json({user:responseData, status: "success"})
        return
    } catch (error:any) {
        res.statusCode = 400
        if(error.code === 'P2002'){
            res.json({status: "error", message: `User with the ${error.meta.target} provided already exists`});
            return
        }
        res.json(error)
        return
    }
});



// Password Reset
// Register
router.post("/reset-password", async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401
            res.send({ error: "incorrect email or password" });
            return
        }
        // Initiate password reset.

        
    } catch (error) {
        console.log(error)
        return

    }
    

});

// Set New Password
router.post("/new-password", async (req: Request, res: Response) => {
    try {
        let { email, password, username, names  } = req.body;
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401
            res.send({ error: "incorrect email or password" });
            return
        }
        
    } catch (error) {

    }

});





export default router