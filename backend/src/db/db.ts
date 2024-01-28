// import { Pool } from "pg";

import { PrismaClient } from "@prisma/client";

// const pool: Pool = new Pool({
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DATABASE,
//   user: process.env.POSTGRES_USERNAME,
//   password: process.env.POSTGRES_PASSWORD,
//   port: Number(process.env.POSTGRES_PORT),
// });

// export const dbQuery = (query: string, params?: string[]) => {
//   return pool.query(query, params);
// };

export const prisma = new PrismaClient();
