import { Router } from 'express';
import { validateBody } from 'shared';
import { registerSchema, loginSchema, refreshSchema } from '../validators/authValidators';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', validateBody(refreshSchema), authController.refresh);

export default router;
