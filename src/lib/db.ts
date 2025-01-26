import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from '../schema';

const sqlite = new Database("sqlite.db", { create: true });
const db = drizzle({ client: sqlite, casing: 'snake_case', schema });

export const useSqlite = () => db;

export type Sqlite = typeof db;