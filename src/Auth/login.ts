import { api, APIError } from "encore.dev/api";
import * as bcrypt from "bcryptjs";
import { getUserByEmailService } from "../User/service";

interface LoginRequest {
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

interface LoginResponse {
  user: UserResponse;
  token: string; // In a real app, this would be a JWT token
  message: string;
}

// Login endpoint
export const login = api(
  { expose: true, auth: false, method: "POST", path: "/auth/login" },
  async (req: LoginRequest): Promise<LoginResponse> => {
    const { email, password } = req;

    // Find user by email
    const user = await getUserByEmailService(email);
    if (!user) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    // In a real application, you would generate a JWT token here
    // For now, we'll return a simple token placeholder
    const token = `token_${user.id}_${Date.now()}`;

    // Return user without password
    const { password: _, ...userResponse } = user;

    return {
      user: userResponse,
      token,
      message: "Login successful",
    };
  }
);

