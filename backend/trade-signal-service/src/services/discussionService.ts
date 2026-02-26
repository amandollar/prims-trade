import mongoose from 'mongoose';
import { ApiError } from 'shared';
import { Discussion, IDiscussion } from '../models/Discussion';
import type { CreateDiscussionInput, UpdateDiscussionInput, CreateCommentInput } from '../validators/discussionValidators';

export async function getAll(): Promise<IDiscussion[]> {
  return Discussion.find().sort({ createdAt: -1 }).lean();
}

export async function getById(id: string): Promise<IDiscussion> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid discussion ID');
  }
  const discussion = await Discussion.findById(id).lean();
  if (!discussion) {
    throw ApiError.notFound('Discussion not found');
  }
  return discussion;
}

export async function create(input: CreateDiscussionInput, userId: string): Promise<IDiscussion> {
  const discussion = await Discussion.create({
    ...input,
    createdBy: new mongoose.Types.ObjectId(userId),
    comments: [],
  });
  return discussion.toObject();
}

export async function update(
  id: string,
  input: UpdateDiscussionInput,
  userId: string,
  isAdmin: boolean
): Promise<IDiscussion> {
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    throw ApiError.notFound('Discussion not found');
  }
  if (discussion.createdBy.toString() !== userId && !isAdmin) {
    throw ApiError.forbidden('You can only edit your own discussions');
  }
  Object.assign(discussion, input);
  await discussion.save();
  return discussion.toObject();
}

export async function remove(id: string, userId: string, isAdmin: boolean): Promise<void> {
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    throw ApiError.notFound('Discussion not found');
  }
  if (discussion.createdBy.toString() !== userId && !isAdmin) {
    throw ApiError.forbidden('You can only delete your own discussions');
  }
  await discussion.deleteOne();
}

export async function addComment(
  discussionId: string,
  input: CreateCommentInput,
  userId: string
): Promise<IDiscussion> {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw ApiError.notFound('Discussion not found');
  }
  discussion.comments.push({
    _id: new mongoose.Types.ObjectId(),
    content: input.content,
    createdBy: new mongoose.Types.ObjectId(userId),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await discussion.save();
  return discussion.toObject();
}

export async function deleteComment(
  discussionId: string,
  commentId: string,
  userId: string,
  isAdmin: boolean
): Promise<IDiscussion> {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw ApiError.notFound('Discussion not found');
  }
  const comment = discussion.comments.find((c) => c._id.toString() === commentId);
  if (!comment) {
    throw ApiError.notFound('Comment not found');
  }
  if (comment.createdBy.toString() !== userId && !isAdmin) {
    throw ApiError.forbidden('You can only delete your own comments');
  }
  discussion.comments = discussion.comments.filter((c) => c._id.toString() !== commentId);
  await discussion.save();
  return discussion.toObject();
}
