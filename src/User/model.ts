import type { User as UserSchema, NewUser as NewUserSchema } from "../../database/schema";

// Re-export types explicitly (Encore requires explicit type exports)
export type User = UserSchema;
export type NewUser = NewUserSchema;
export type CreateUserInput = Omit<NewUser, "createdAt" | "updatedAt">;
export type UserResponse = Omit<User, "password">;

