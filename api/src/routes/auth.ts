import express, {Request, Response} from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import * as bcrypt from 'bcrypt'

const router = express.Router()


// Generate Access Token
router.post("/token", async (req, res) => {
    let { name } = req.query;
    console.log(req.headers.authorization)

});

// Get User Information.
router.get("/me", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401
            res.send({ error: "invalid access token" });
            return
        }
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        console.log(decodedSession)
        if(decodedSession.type == 'valid'){
            let userId = decodedSession.session.userId
            let user = await db.user.findFirst({
                where:{
                    id: userId
                }
            })
            let responseData = {id:user?.id, createdAt:user?.createdAt, updatedAt: user?.updatedAt, names:user?.names, email: user?.email, role: user?.role}
            res.statusCode = 200
            res.json({data:responseData, status:"success"})
            return
        }                   
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({status:"error", error})
        return   
    }
});


// Login
router.post("/login", async (req: Request, res: Response) => {
    try {
        let { email ,username, password } = req.body;
        if(!email && !password && !email){
            res.statusCode = 400
            res.json({status:"error", message: "email or username is required to login"})
            return
        }
        let user = await db.user.findFirst({
            where: {
                ...(email) && {email},
                ...(username) && {username}
            }
        })
        const validPassword = await bcrypt.compare(password, user?.password as string);
        if(validPassword){
            let session = encodeSession(process.env['SECRET_KEY'] as string, {
                createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
                userId: user?.id as string,
                role: user?.role as string
            })
            res.json({status:"success",token:session.token, issued: session.issued, expires: session.expires})
            return
        }else{
            res.statusCode = 401
            res.json({status:"error", message: "Incorrect username/password or password provided"})
            return
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.send({ error: "incorrect email or password" });
        return
    }
});


// Register User
router.post("/register", async (req: Request, res: Response) => {
    try {
        let { email, password, username, names, role } = req.body;
        let roles: string[];
        roles = ["ADMINISTRATOR","STAFF", "NURSE","PEDIATRICIAN","NURSE_COUNSELLOR","CLINICIAN","NUTRITIONIST"]
        if(role && (roles.indexOf(role) < 0)){
            res.json({status: "error", message: `Invalid role name *${role}* provided`});
            return
        }
        let salt = await bcrypt.genSalt(10)
        let _password = await bcrypt.hash(password, salt)
        let user = await db.user.create({
            data:{
                email, names, username, role: (role?role:'STAFF'), salt:salt, password: _password
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


// Register
router.post("/reset-password", async (req: Request, res: Response) => {
    try {
        let { username, email  } = req.body;
        // Initiate password reset.

        
    } catch (error) {
        console.log(error)
        return

    }
    

});

// Set New Password
router.post("/new-password", async (req: Request, res: Response) => {
    try {
        let { password  } = req.body;
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