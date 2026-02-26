import { Router } from 'express';
import { requireAuth, requireRole, validateBody, validateParams } from 'shared';
import {
  createTradeSignalSchema,
  updateTradeSignalSchema,
  updateTradeSignalStatusSchema,
  tradeSignalIdParamSchema,
} from '../validators/tradeSignalValidators';
import * as tradeSignalController from '../controllers/tradeSignalController';

const router = Router();

router.get('/public', tradeSignalController.getApprovedSignalsPublic);

router.use(requireAuth);

router.post('/', validateBody(createTradeSignalSchema), tradeSignalController.createSignal);
router.get('/', tradeSignalController.getMySignals);
router.get('/admin', requireRole('admin'), tradeSignalController.getAllSignalsAdmin);
router.get('/:id', validateParams(tradeSignalIdParamSchema), tradeSignalController.getSignalById);
router.patch(
  '/:id',
  validateParams(tradeSignalIdParamSchema),
  validateBody(updateTradeSignalSchema),
  tradeSignalController.updateSignal
);
router.patch(
  '/:id/status',
  requireRole('admin'),
  validateParams(tradeSignalIdParamSchema),
  validateBody(updateTradeSignalStatusSchema),
  tradeSignalController.updateSignalStatus
);
router.delete('/:id', validateParams(tradeSignalIdParamSchema), tradeSignalController.deleteSignal);

export default router;
