import { and, eq } from "drizzle-orm";
import type { Sqlite } from "../lib/db";
import { todos } from "../schema";

interface TodoChange {
  description?: string;
  id: number;
  userId: number;
  isDone?: boolean;
}

class TodoService {
  private db: Sqlite;
  constructor({ db }: { db: Sqlite }) {
    this.db = db;
  }

  public list({
    pageSize,
    pageNumber,
    userId,
  }: {
    pageSize: number;
    pageNumber: number;
    userId: number;
  }) {
    return this.db.query.todos.findMany({
      where: (todos, { eq }) => eq(todos.userId, userId),
      limit: pageSize,
      offset: pageSize * (pageNumber - 1),
    });
  }

  public add({ description, userId }: { description: string; userId: number }) {
    return this.db
      .insert(todos)
      .values({
        userId,
        description,
      })
      .returning({ id: todos.id });
  }

  public update({ description, userId, id, isDone }: TodoChange) {
    const changed: Partial<TodoChange> = {};
    if (typeof description === "string") {
      changed.description = description;
    }

    if (typeof isDone === "boolean") {
      changed.isDone = isDone;
    }

    if (Object.keys(changed).length === 0) {
      return;
    }

    return this.db
      .update(todos)
      .set(changed)
      .where(and(eq(todos.userId, userId), eq(todos.id, id)));
  }

  public delete({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }) {
    return this.db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .limit(1);
  }
}

export { TodoService };
