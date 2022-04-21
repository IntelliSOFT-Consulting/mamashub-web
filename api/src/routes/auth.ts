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
            res.json({ error: "Invalid access token", status:"error" });
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
        res.json({status:"error", error:error})
        return   
    }
});


// Login
router.post("/login", async (req: Request, res: Response) => {
    try {
        let { email ,username, password } = req.body;
        if(!email && !password && !email){
            res.statusCode = 400
            res.json({status:"error", message: "email or username  and password are required to login"})
            return
        }
        let user = await db.user.findFirst({
            where: {
                ...(email) && {email},
                ...(username) && {username}
            }
        })
        if(user?.resetToken){
            res.statusCode = 401
            res.json({status:"error", message: "Kindly complete password reset or verify your account to proceed. Check reset instructions in your email."})
            return
        }
        const validPassword = await bcrypt.compare(password, user?.password as string);
        if(validPassword){
            let session = encodeSession(process.env['SECRET_KEY'] as string, {
                createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
                userId: user?.id as string,
                role: user?.role as string
            })
            res.json({status:"success", token:session.token, issued: session.issued, expires: session.expires})
            return
        }else{
            res.statusCode = 401
            res.json({status:"error", message: "Incorrect username/password or password provided"})
            return
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.json({ error: "incorrect email or password" });
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
            res.json({status: "error", error: `User with the ${error.meta.target} provided already exists`});
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
        let user = await db.user.findFirst({
            where: {
                ...(email) && {email},
                ...(username) && {username}
            }
        })

        let session = encodeSession(process.env['SECRET_KEY'] as string, {
            createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
            userId: user?.id as string,
            role: "RESET_TOKEN"
        })
        user = await db.user.update({
            where: {
                ...(email) && {email},
                ...(username) && {username}
            }, 
            data:{
                resetToken:session.token,
                resetTokenExpiresAt: new Date(session.expires)
            }
        })
        res.statusCode = 200
        let resetUrl = `${process.env['WEB_URL']}/new-password?id=${user?.id}&token=${user?.resetToken}`
        console.log(resetUrl)
        res.json({ message: `Password reset instructions have been sent to your email, ${user?.email}` , status:"success", _reset_url:`${resetUrl}`});
        return
        
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.json({ error: error , status:"error"});
        return
    }
    
});

// Set New Password
router.post("/new-password",[requireJWT], async (req: Request, res: Response) => {
    try {
        let { password, id } = req.body;
        let user = await db.user.findFirst({
            where: {
                id:id as string
            }
        })
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(" ")[1] as string)
        if ((decodedSession.type !== 'valid') || !(user?.resetToken) || ((user?.resetTokenExpiresAt as Date) < new Date()) 
            || (decodedSession.session?.role !== 'RESET_TOKEN')
        ) {
            res.statusCode = 401
            res.json({ error: `Invalid and/or expired password reset token. Code: ${decodedSession.type}` , status:"error"});
            return
        }
        let salt = await bcrypt.genSalt(10)
        let _password = await bcrypt.hash(password, salt)
        user = await db.user.update({
            where: {
                id:id as string
            }, 
            data:{
                password: _password, salt:salt, resetToken: null, resetTokenExpiresAt: null
            }
        })
        res.statusCode = 200
        res.json({ message: "Password Reset Successfully" , status:"success"});
        return
    } catch (error) {
        res.statusCode = 401
        res.json({ error: error , status:"error"});
        return
    }

});


// Delete User
router.delete("/", async (req: Request, res: Response) => {
    try {
        let { email, username, } = req.body;
        let user = await db.user.delete({
            where: {
                ...(email) && {email},
                ...(username) && {username}
            }
        })
        let responseData = user
        res.statusCode = 201
        res.json({user:responseData, status: "success"})
        return
    } catch (error:any) {
        res.statusCode = 400
        if(error.code === 'P2002'){
            res.json({status: "error", error: `User with the ${error.meta.target} provided already exists`});
            return
        }
        res.json(error)
        return
    }
});



export default router