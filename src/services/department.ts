import { and, eq } from "drizzle-orm";
import type { Sqlite } from "../lib/db";
import { departments } from "../schema";

type SelectDepartment = typeof departments.$inferSelect;
type InsertDepartment = typeof departments.$inferInsert;
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
    return this.db.query.departments.findMany({
      where: (departments, { eq }) => eq(departments.userId, userId),
      limit: pageSize,
      offset: pageSize * (pageNumber - 1),
    });
  }

  public add({ userId, country, city }: InsertDepartment) {
    return this.db
      .insert(departments)
      .values({
        userId,
        country,
        city,
      })
      .returning({ id: departments.id });
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
      .update(departments)
      .set(changed)
      .where(and(eq(departments.userId, userId), eq(departments.id, id)));
  }

  public delete({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }) {
    return this.db
      .delete(departments)
      .where(and(eq(departments.id, id), eq(departments.userId, userId)))
      .limit(1);
  }
}

export { DepartmentService };
