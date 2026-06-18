import postgres from "postgres";

const globalForSql = globalThis as unknown as { sql: ReturnType<typeof postgres> | undefined };

const sql =
  globalForSql.sql ??
  postgres(process.env.DATABASE_URL!, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    types: {
      numeric: {
        to: 1700,
        from: [1700],
        parse: parseFloat,
        serialize: String,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForSql.sql = sql;
}

export { sql };
