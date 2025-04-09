import type { Sqlite } from "../lib/db";
import { user } from "../schema";

class UserService {
  private db: Sqlite;
  constructor({ db }: { db: Sqlite }) {
    this.db = db;
  }

  public getUser(id: string) {
    return this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, Number(id)),
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
    return this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
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
    const current = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
      columns: {
        id: true,
      },
    });
    return !!current?.id;
  }

  public createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.db
      .insert(user)
      .values({
        name,
        email,
        password,
        role: "guest",
        nickName: "",
      })
      .returning({ id: user.id });
  }

  public deleteUser(id: string) {
    // return this.db.delete(users).where((users, { eq }) => eq(users.id, Number(id)));
  }
}

export { UserService };
