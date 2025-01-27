import { Database } from "bun:sqlite";

const sqlite = new Database("sqlite.db", { create: true });


Bun.serve({
  development: false,

  async fetch(req) {
    // ...your API code
    if (req.url.endsWith("/api/user/users")) {
      const users = await sqlite.query("SELECT * FROM users").all();
      return Response.json(users);
    }

    // Return 404 for unmatched routes
    return new Response("Not Found", { status: 404 });
  },
});