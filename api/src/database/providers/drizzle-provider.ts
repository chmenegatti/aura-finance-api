import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { InferModel } from "drizzle-orm";
import { eq, sql } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { randomUUID } from "node:crypto";

import { env } from "../../config/env.js";
import { User } from "../../modules/users/entities/user.entity.js";
import type { CreateUserPayload, DatabaseProvider, UserProvider } from "./types.js";

const createDb = () => {
  const client = createClient({
    url: env.dbPath,
    authToken: env.tursoAuthToken,
  });

  return drizzle(client);
};

const usersTable = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("passwordHash").notNull(),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
);

type UserRow = InferModel<typeof usersTable>;

const toUserEntity = (row: UserRow) => {
  const user = new User();
  user.id = row.id;
  user.name = row.name;
  user.email = row.email;
  user.passwordHash = row.passwordHash;
  user.createdAt = new Date(row.createdAt);
  user.updatedAt = new Date(row.updatedAt);

  return user;
};

class DrizzleUserProvider implements UserProvider {
  private db = createDb();
  async findByEmail(email: string) {
    const [row] = await this.db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    return row ? toUserEntity(row) : null;
  }

  async findById(id: string) {
    const [row] = await this.db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return row ? toUserEntity(row) : null;
  }

  async create(payload: CreateUserPayload) {
    const now = new Date().toISOString();
    const [created] = await this.db
      .insert(usersTable)
      .values({
        id: randomUUID(),
        name: payload.name,
        email: payload.email,
        passwordHash: payload.passwordHash,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return toUserEntity(created);
  }
}

export function drizzleProviderFactory(): DatabaseProvider {
  return {
    users: new DrizzleUserProvider(),
  };
}
