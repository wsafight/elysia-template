import { and, eq } from "drizzle-orm";
import type { Sqlite } from "../lib/db";
import { todo } from "../schema";

type SelectTodo = typeof todo.$inferSelect;
type InsertTodo = typeof todo.$inferInsert;
type UpdateTodo = InsertTodo & { id: number };

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
  }): Promise<SelectTodo[]> {
    return this.db.query.todo.findMany({
      where: (todo, { eq }) => eq(todo.userId, userId),
      limit: pageSize,
      offset: pageSize * (pageNumber - 1),
    });
  }

  public add({ userId, description, isDone }: InsertTodo) {
    return this.db
      .insert(todo)
      .values({
        userId,
        description,
        isDone,
      })
      .returning({ id: todo.id });
  }

  public update({ id, userId, description, isDone }: UpdateTodo) {
    const changed: Partial<UpdateTodo> = {};

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
      .update(todo)
      .set(changed)
      .where(and(eq(todo.userId, userId), eq(todo.id, id)));
  }

  public delete({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }) {
    return this.db
      .delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .limit(1);
  }
}

export { TodoService };
