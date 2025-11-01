import * as p from "drizzle-orm/pg-core";

// Users table
export const users = p.pgTable("users", {
  id: p.serial("id").primaryKey(),
  name: p.text("name").notNull(),
  email: p.text("email").notNull().unique(),
  password: p.text("password").notNull(),
  createdAt: p.timestamp("created_at").defaultNow().notNull(),
  updatedAt: p.timestamp("updated_at").defaultNow().notNull(),
});

// Todos table
export const todos = p.pgTable("todos", {
  id: p.serial("id").primaryKey(),
  userId: p.integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: p.text("title").notNull(),
  description: p.text("description"),
  completed: p.boolean("completed").default(false).notNull(),
  createdAt: p.timestamp("created_at").defaultNow().notNull(),
  updatedAt: p.timestamp("updated_at").defaultNow().notNull(),
});

// Explicit type definitions (Encore doesn't support typeof inference)
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewTodo {
  userId: number;
  title: string;
  description?: string | null;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

