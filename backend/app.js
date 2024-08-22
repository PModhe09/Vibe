import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import songRoutes from './routes/songRoutes.js';

dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/playlist',playlistRoutes);
app.use('/api/songs',songRoutes);

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server started`);
})