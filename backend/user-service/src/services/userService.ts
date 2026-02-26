import { ApiError } from 'shared';
import { User } from '../models/User';
import type { UpdateMeInput } from '../validators/userValidators';
import type { JwtPayload } from 'shared';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getMe(userId: string): Promise<UserProfile | null> {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) return null;
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function updateMe(userId: string, input: UpdateMeInput): Promise<UserProfile> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  if (input.name !== undefined) user.name = input.name;
  await user.save();

  const updated = await User.findById(userId).select('-passwordHash');
  if (!updated) throw ApiError.internal();
  return {
    id: updated._id.toString(),
    email: updated.email,
    role: updated.role,
    name: updated.name,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}
