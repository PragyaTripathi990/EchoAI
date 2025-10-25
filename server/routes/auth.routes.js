import express from 'express';
import { register, login, logout,  } from '../controllers/auth.controller.js';
const authRouter = express.Router();
authRouter.post('/signup', register);
authRouter.post('/signin', login);
authRouter.get('/logout', logout); // Changed to GET to match frontend
authRouter.post('/logout', logout); // Keep POST for compatibility
export default authRouter;
