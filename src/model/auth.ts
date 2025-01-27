import { t } from "elysia";

const registerSchema = t.Object({
  name: t.String({ minLength: 6 }),
  password: t.String({ minLength: 8 }),
  email: t.String({ format: "email" }),
});

const signupBodySchema = t.Object({
  name: t.String({ maxLength: 60, minLength: 1 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  location: t.Optional(t.Tuple([t.Number(), t.Number()])),
  isAdult: t.Boolean(),
});

type Register = typeof registerSchema.static;

export type { Register };
export { signupBodySchema, registerSchema };
