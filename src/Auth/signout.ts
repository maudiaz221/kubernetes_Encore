import { api } from "encore.dev/api";

interface SignoutRequest {
  token?: string;
}

interface SignoutResponse {
  message: string;
}

// Signout endpoint
export const signout = api(
  { expose: true, auth: false, method: "POST", path: "/auth/signout" },
  async (req: SignoutRequest): Promise<SignoutResponse> => {
    // In a real application, you would invalidate the token here
    // For now, we'll just return a success message
    return {
      message: "Signout successful",
    };
  }
);

