import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import schema from "./server/db/schema.js";
import { DATABASE_URL } from '$env/static/private';

const client = createClient({
    url: DATABASE_URL
});

export const db = drizzle(client, { schema });