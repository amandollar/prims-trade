import { Router } from 'express';
import { requireAuth, validateBody } from 'shared';
import { updateMeSchema } from '../validators/userValidators';
import * as userController from '../controllers/userController';

const router = Router();

router.use(requireAuth);

router.get('/me', userController.getMe);
router.patch('/me', validateBody(updateMeSchema), userController.updateMe);

export default router;
