import { Router } from 'express';
import { requireAuth, validateBody } from 'shared';
import {
  createDiscussionSchema,
  updateDiscussionSchema,
  createCommentSchema,
} from '../validators/discussionValidators';
import * as discussionController from '../controllers/discussionController';

const router = Router();

router.get('/', discussionController.getAll);
router.get('/:id', discussionController.getById);
router.post('/', requireAuth, validateBody(createDiscussionSchema), discussionController.create);
router.patch('/:id', requireAuth, validateBody(updateDiscussionSchema), discussionController.update);
router.delete('/:id', requireAuth, discussionController.remove);

router.post('/:id/comments', requireAuth, validateBody(createCommentSchema), discussionController.addComment);
router.delete('/:id/comments/:commentId', requireAuth, discussionController.deleteComment);

export default router;
