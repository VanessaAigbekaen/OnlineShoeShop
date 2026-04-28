import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
    plugins: [sveltekitCookies(getRequestEvent), admin()],
    baseURL: env.ORIGIN,
    secret: env.BETTER_AUTH_SECRET,
    user: {
        deleteUser: {
            enabled: true
        }
    },

    advanced: {
        database: {
            generateId: 'serial'
        }
    },

    database: drizzleAdapter(db, { provider: 'sqlite' }),
    emailAndPassword: { enabled: true },
});