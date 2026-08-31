import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';
import followRouter from './routes/follow.route.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req,res)=>{ res.status(200).json({msg: "Working"})});

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', followRouter);

export default app;