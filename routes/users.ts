import express from "express";
import db from '../lib/prisma'

const router = express.Router()

router.get("/", async (req, res) => {
    let { name } = req.query;
    if (!name) {
      res.statusCode = 403
      res.send({ error: "Invalid name" });
    }
    try {
      let user = await db.user.create({
        data: {
          email: `${name}@fakemail.oo`,
          password: "password",
        },
      });
      console.log(user);
      res.send({ data: user, status:"success" });
    } catch (error) {
      res.statusCode = 401;
      if (error.code == 'P2002'){
        res.send({ status:"error", message:"User already exists" });
      }
  
    }
  });

export default router