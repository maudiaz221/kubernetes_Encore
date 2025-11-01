import * as bcrypt from "bcryptjs";
import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "./repository";
import type { CreateUserInput, UserResponse } from "./model";

export const createUserService = async (
  userData: CreateUserInput
): Promise<UserResponse> => {
  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create user
  const user = await createUser({
    ...userData,
    password: hashedPassword,
  });

  // Return user without password
  const { password, ...userResponse } = user;
  return userResponse;
};

export const getUserByIdService = async (
  id: number
): Promise<UserResponse | null> => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  const { password, ...userResponse } = user;
  return userResponse;
};

export const getUserByEmailService = async (email: string) => {
  return await getUserByEmail(email);
};

export const updateUserService = async (
  id: number,
  updates: Partial<CreateUserInput>
): Promise<UserResponse> => {
  // If password is being updated, hash it
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const user = await updateUser(id, updates);
  if (!user) {
    throw new Error("User not found");
  }

  const { password, ...userResponse } = user;
  return userResponse;
};

export const deleteUserService = async (id: number): Promise<void> => {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  await deleteUser(id);
};

