import { api, APIError } from "encore.dev/api";
import {
  createUserService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "./service";

// Request interfaces
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

// Response interface (Encore requires interfaces, not type aliases)
interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a new user
export const createUser = api(
  { expose: true, auth: false, method: "POST", path: "/users" },
  async (req: CreateUserRequest): Promise<UserResponse> => {
    try {
      return await createUserService(req);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        throw APIError.alreadyExists(error.message);
      }
      throw APIError.internal("Failed to create user");
    }
  }
);

// Get user by ID
export const getUser = api(
  { expose: true, auth: false, method: "GET", path: "/users/:id" },
  async ({ id }: { id: string }): Promise<UserResponse> => {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw APIError.invalidArgument("Invalid user ID");
    }

    const user = await getUserByIdService(userId);
    if (!user) {
      throw APIError.notFound("User not found");
    }
    return user;
  }
);

// Update user
export const updateUser = api(
  { expose: true, auth: false, method: "PUT", path: "/users/:id" },
  async ({
    id,
    ...updates
  }: { id: string } & UpdateUserRequest): Promise<UserResponse> => {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw APIError.invalidArgument("Invalid user ID");
    }

    try {
      return await updateUserService(userId, updates);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw APIError.notFound(error.message);
      }
      throw APIError.internal("Failed to update user");
    }
  }
);

// Delete user
export const deleteUser = api(
  { expose: true, auth: false, method: "DELETE", path: "/users/:id" },
  async ({ id }: { id: string }): Promise<{ message: string }> => {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw APIError.invalidArgument("Invalid user ID");
    }

    try {
      await deleteUserService(userId);
      return { message: "User deleted successfully" };
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw APIError.notFound(error.message);
      }
      throw APIError.internal("Failed to delete user");
    }
  }
);

