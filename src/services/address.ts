import { and, eq } from "drizzle-orm";
import type { Sqlite } from "../lib/db";
import { address } from "../schema";

type SelectAddress = typeof address.$inferSelect;
type InsertAddress = typeof address.$inferInsert;
type UpdateAddress = InsertAddress & { id: number };

class AddressService {
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
  }): Promise<SelectAddress[]> {
    return this.db.query.address.findMany({
      where: (address, { eq }) => eq(address.userId, userId),
      limit: pageSize,
      offset: pageSize * (pageNumber - 1),
    });
  }

  public add({ userId, country, city }: InsertAddress) {
    return this.db
      .insert(address)
      .values({
        userId,
        country,
        city,
      })
      .returning({ id: address.id });
  }

  public update({ id, userId, country, city }: UpdateAddress) {
    const changed: Partial<UpdateAddress> = {};

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
      .update(address)
      .set(changed)
      .where(and(eq(address.userId, userId), eq(address.id, id)));
  }

  public delete({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }) {
    return this.db
      .delete(address)
      .where(and(eq(address.id, id), eq(address.userId, userId)))
      .limit(1);
  }
}

export { AddressService };
