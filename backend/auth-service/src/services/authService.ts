import { ApiError } from 'shared';
import { User } from '../models/User';
import { hashPassword, comparePassword } from 'shared';
import { signAccessToken, signRefreshToken, verifyToken } from 'shared';
import type { RegisterInput, LoginInput, RefreshInput } from '../validators/authValidators';
import type { Role } from 'shared';

export interface AuthResult {
  user: { id: string; email: string; role: Role; name?: string };
  accessToken: string;
  refreshToken: string;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict('Email already registered');
  }

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    email: input.email.toLowerCase(),
    passwordHash,
    role: (input.role ?? 'user') as Role,
    name: input.name,
  });

  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    accessToken,
    refreshToken,
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    accessToken,
    refreshToken,
  };
}

export async function refresh(input: RefreshInput): Promise<AuthResult> {
  const payload = verifyToken(input.refreshToken);
  const user = await User.findById(payload.userId);
  if (!user) {
    throw ApiError.unauthorized('User not found');
  }
  const newAccessToken = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = signRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
