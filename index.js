import express from 'express'
import apiRouter from './routes/index.js';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
 import cors from 'cors';
 dotenv.config();


const app = express();

app.use(cors({
  origin: 'http://localhost:5173',           // 'https://frontend-car-rental-vert.vercel.app', 
  credentials:true,
}))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const port =process.env.PORT

connectDB()



app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/api',apiRouter)
app.listen(port,()=>{
    console.log(`Example app listenng on port ${port}`);
    
})

