import { api } from "encore.dev/api";

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export const health = api(
  { expose: true, auth: false, method: "GET", path: "/" },
  async (): Promise<HealthResponse> => {
    return {
      status: "ok",
      message: "API working properly",
      timestamp: new Date().toISOString(),
    };
  }
);

