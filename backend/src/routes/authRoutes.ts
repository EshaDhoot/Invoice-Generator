import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { validateRegistration, validateLogin } from '../middlewares/validationMiddleware';

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;