import type { Todo as TodoSchema, NewTodo as NewTodoSchema } from "../../database/schema";

// Re-export types explicitly (Encore requires explicit type exports)
export type Todo = TodoSchema;
export type NewTodo = NewTodoSchema;
export type CreateTodoInput = Omit<NewTodo, "createdAt" | "updatedAt">;
export type UpdateTodoInput = Partial<Omit<NewTodo, "userId" | "createdAt" | "updatedAt">>;

