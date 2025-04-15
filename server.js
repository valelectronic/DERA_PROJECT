import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
 
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

//middlewares 
app.use(express.json());
 
//routes
app.use("/api/auth",authRoutes)


app.listen(port,() => {
    
    console.log(` Server is running on http://localhost:${port}`);
});
