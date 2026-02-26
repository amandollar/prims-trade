import mongoose from 'mongoose';
import { UserSchema, IUser } from 'shared';

export const User = mongoose.model<IUser>('User', UserSchema);
