import express from "express";
import { PrismaClient } from "@prisma/client";


//Import routes 
import Index from './routes/main'
import Users from './routes/users'

const app = express();
const PORT = 8080;
const prisma = new PrismaClient();


app.use('/', Index)
app.use('/users', Users)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});