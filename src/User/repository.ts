import { orm } from "../../database/database";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";
import type { NewUser } from "../../database/schema";

export const createUser = async (userData: NewUser) => {
  const [user] = await orm.insert(users).values(userData).returning();
  return user;
};

export const getUserById = async (id: number) => {
  const [user] = await orm.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
};

export const getUserByEmail = async (email: string) => {
  const [user] = await orm
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
};

export const updateUser = async (id: number, updates: Partial<NewUser>) => {
  const [user] = await orm
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
};

export const deleteUser = async (id: number) => {
  await orm.delete(users).where(eq(users.id, id));
};

