import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
 
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

//middlewares 
app.use(express.json());
app.use(cookieParser())
 
//routes
app.use("/api/auth",authRoutes)



app.listen(port,() => {
    
    console.log(` Server is running on http://localhost:${port}`);
    connectDB()
});
