import express from "express";

import * as dotenv from 'dotenv'

dotenv.config() // Load environment variables

//Import routes 
import Index from './routes/main'
import Auth from './routes/auth'
import Users from './routes/users'

const app = express();
const PORT = 8080;

app.use(express.json())

app.use('/', Index)
app.use('/auth', Auth)
app.use('/users', Users)


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});