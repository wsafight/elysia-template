import type { Sqlite } from "../lib/db";
import type { Register } from "../model/auth";
import { users } from "../schema";

class UserService {
  private db: Sqlite;
  constructor({ db }: { db: Sqlite }) {
    this.db = db;
  }

  public getUser(id: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, Number(id)),
      columns: {
        password: false, //ignored
      },
    });
  }

  public loginByPassword({
    email,
  }: {
    email: string;
  }) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  public async hasEmailUser({
    email,
  }: {
    email: string;
  }): Promise<boolean> {
    const current = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: {
        id: true,
      },
    });
    return !!current?.id;
  }

  public createUser({ name, email, password }: Register) {
    return this.db
      .insert(users)
      .values({
        name,
        email,
        password,
        role: "guest",
        nickName: "",
      })
      .returning({ id: users.id });
  }

  public deleteUser(id: string) {
    // return this.db.delete(users).where((users, { eq }) => eq(users.id, Number(id)));
  }
}

export { UserService };
