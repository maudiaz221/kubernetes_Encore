import { api, APIError } from "encore.dev/api";
import { createUserService } from "../User/service";

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// User response interface (no password)
interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SignupResponse {
  user: UserResponse;
  token: string; // In a real app, this would be a JWT token
  message: string;
}

// Signup endpoint
export const signup = api(
  { expose: true, auth: false, method: "POST", path: "/auth/signup" },
  async (req: SignupRequest): Promise<SignupResponse> => {
    try {
      // Create user
      const user = await createUserService(req);

      // In a real application, you would generate a JWT token here
      // For now, we'll return a simple token placeholder
      const token = `token_${user.id}_${Date.now()}`;

      return {
        user,
        token,
        message: "User created successfully",
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        throw APIError.alreadyExists("User with this email already exists");
      }
      throw APIError.internal("Failed to create user");
    }
  }
);

