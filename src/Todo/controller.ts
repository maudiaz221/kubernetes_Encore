import { api, APIError } from "encore.dev/api";
import {
  createTodoService,
  getTodoByIdService,
  getTodosByUserIdService,
  updateTodoService,
  deleteTodoService,
  toggleTodoCompleteService,
} from "./service";

// Request interfaces
interface CreateTodoRequest {
  userId: number;
  title: string;
  description?: string;
}

interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Response interfaces (Encore requires interfaces, not type aliases)
interface TodoResponse {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ListTodosResponse {
  todos: TodoResponse[];
}

// Create a new todo
export const createTodo = api(
  { expose: true, auth: false, method: "POST", path: "/todos" },
  async (req: CreateTodoRequest): Promise<TodoResponse> => {
    try {
      return await createTodoService(req);
    } catch (error) {
      throw APIError.internal("Failed to create todo");
    }
  }
);

// Get todo by ID
export const getTodo = api(
  { expose: true, auth: false, method: "GET", path: "/todos/:id" },
  async ({ id }: { id: string }): Promise<TodoResponse> => {
    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      throw APIError.invalidArgument("Invalid todo ID");
    }

    const todo = await getTodoByIdService(todoId);
    if (!todo) {
      throw APIError.notFound("Todo not found");
    }
    return todo;
  }
);

// Get all todos for a user
export const listTodos = api(
  { expose: true, auth: false, method: "GET", path: "/todos/user/:userId" },
  async ({ userId }: { userId: string }): Promise<ListTodosResponse> => {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      throw APIError.invalidArgument("Invalid user ID");
    }

    const todos = await getTodosByUserIdService(userIdNum);
    return { todos };
  }
);

// Update todo
export const updateTodo = api(
  { expose: true, auth: false, method: "PUT", path: "/todos/:id" },
  async ({
    id,
    ...updates
  }: { id: string } & UpdateTodoRequest): Promise<TodoResponse> => {
    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      throw APIError.invalidArgument("Invalid todo ID");
    }

    try {
      return await updateTodoService(todoId, updates);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw APIError.notFound(error.message);
      }
      throw APIError.internal("Failed to update todo");
    }
  }
);

// Toggle todo completion status
export const toggleTodo = api(
  { expose: true, auth: false, method: "PATCH", path: "/todos/:id/toggle" },
  async ({ id }: { id: string }): Promise<TodoResponse> => {
    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      throw APIError.invalidArgument("Invalid todo ID");
    }

    try {
      return await toggleTodoCompleteService(todoId);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw APIError.notFound(error.message);
      }
      throw APIError.internal("Failed to toggle todo");
    }
  }
);

// Delete todo
export const deleteTodo = api(
  { expose: true, auth: false, method: "DELETE", path: "/todos/:id" },
  async ({ id }: { id: string }): Promise<{ message: string }> => {
    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      throw APIError.invalidArgument("Invalid todo ID");
    }

    try {
      await deleteTodoService(todoId);
      return { message: "Todo deleted successfully" };
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw APIError.notFound(error.message);
      }
      throw APIError.internal("Failed to delete todo");
    }
  }
);

