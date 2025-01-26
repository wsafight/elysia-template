import type { Sqlite } from "../lib/db";
import { users } from "../schema";

class UserService {
  private db: Sqlite;
  constructor({ db }: { db: Sqlite }) {
    this.db = db;
  }

  public getUser(id: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, Number(id)),
    });
  }

  public getUsers() {
    return this.db.query.users.findMany();
  }

  public createUser({
    firstName,
    lastName,
  }: { firstName: string; lastName: string }) {
    return this.db
      .insert(users)
      .values({
        firstName,
        lastName,
        role: "guest",
      })
      .returning({ id: users.id });
  }

  public deleteUser(id: string) {
    // return this.db.delete(users).where((users, { eq }) => eq(users.id, Number(id)));
  }
}

export { UserService };
