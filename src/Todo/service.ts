import {
  createTodo,
  getTodoById,
  getTodosByUserId,
  updateTodo,
  deleteTodo,
} from "./repository";
import type { CreateTodoInput, UpdateTodoInput, Todo } from "./model";

export const createTodoService = async (
  todoData: CreateTodoInput
): Promise<Todo> => {
  return await createTodo(todoData);
};

export const getTodoByIdService = async (
  id: number
): Promise<Todo | null> => {
  return await getTodoById(id);
};

export const getTodosByUserIdService = async (
  userId: number
): Promise<Todo[]> => {
  return await getTodosByUserId(userId);
};

export const updateTodoService = async (
  id: number,
  updates: UpdateTodoInput
): Promise<Todo> => {
  const todo = await updateTodo(id, updates);
  if (!todo) {
    throw new Error("Todo not found");
  }
  return todo;
};

export const deleteTodoService = async (id: number): Promise<void> => {
  const todo = await getTodoById(id);
  if (!todo) {
    throw new Error("Todo not found");
  }
  await deleteTodo(id);
};

export const toggleTodoCompleteService = async (
  id: number
): Promise<Todo> => {
  const todo = await getTodoById(id);
  if (!todo) {
    throw new Error("Todo not found");
  }

  return await updateTodoService(id, { completed: !todo.completed });
};

