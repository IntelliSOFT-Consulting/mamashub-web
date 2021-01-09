import express from 'express';
// rest of the code remains same
import {PrismaClient} from '@prisma/client'

const app = express();
const PORT = 8080;
const prisma = new PrismaClient()

app.get('/', async (req, res) => {
  
  let {name, email} = req.query
  // let user = await prisma.user.create({
  //   data: {
  //     email:"email1@yahoo.com",
  //     password: "password"
  //   }
  // })
  // console.log(user)
  res.send({name, email})
  });


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});