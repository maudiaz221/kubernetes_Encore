import { orm } from "../../database/database";
import { todos } from "../../database/schema";
import { eq, and } from "drizzle-orm";
import type { NewTodo } from "../../database/schema";

export const createTodo = async (todoData: NewTodo) => {
  const [todo] = await orm.insert(todos).values(todoData).returning();
  return todo;
};

export const getTodoById = async (id: number) => {
  const [todo] = await orm.select().from(todos).where(eq(todos.id, id)).limit(1);
  return todo;
};

export const getTodosByUserId = async (userId: number) => {
  return await orm
    .select()
    .from(todos)
    .where(eq(todos.userId, userId));
};

export const updateTodo = async (id: number, updates: Partial<NewTodo>) => {
  const [todo] = await orm
    .update(todos)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(todos.id, id))
    .returning();
  return todo;
};

export const deleteTodo = async (id: number) => {
  await orm.delete(todos).where(eq(todos.id, id));
};

export const deleteTodosByUserId = async (userId: number) => {
  await orm.delete(todos).where(eq(todos.userId, userId));
};

