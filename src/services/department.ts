import { and, eq } from "drizzle-orm";
import type { Sqlite } from "../lib/db";
import { department } from "../schema";

type SelectDepartment = typeof department.$inferSelect;
type InsertDepartment = typeof department.$inferInsert;
type UpdateDepartment = InsertDepartment & { id: number };

class DepartmentService {
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
  }): Promise<SelectDepartment[]> {
    return this.db.query.department.findMany({
      where: (department, { eq }) => eq(department.userId, userId),
      limit: pageSize,
      offset: pageSize * (pageNumber - 1),
    });
  }

  public add({ userId, country, city }: InsertDepartment) {
    return this.db
      .insert(department)
      .values({
        userId,
        country,
        city,
      })
      .returning({ id: department.id });
  }

  public update({ id, userId, country, city }: UpdateDepartment) {
    const changed: Partial<UpdateDepartment> = {};

    if (typeof country === "string") {
      changed.country = country;
    }

    if (typeof city === "string") {
      changed.city = city;
    }

    if (Object.keys(changed).length === 0) {
      return;
    }

    return this.db
      .update(department)
      .set(changed)
      .where(and(eq(department.userId, userId), eq(department.id, id)));
  }

  public delete({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }) {
    return this.db
      .delete(department)
      .where(and(eq(department.id, id), eq(department.userId, userId)))
      .limit(1);
  }
}

export { DepartmentService };
