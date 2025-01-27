Bun.serve({
  development: false,

  async fetch(req) {
    return new Response("hello world!", { status: 200 });
  },
});