// Admin JS file

import { error, redirect } from "@sveltejs/kit";
import { usersService } from "$lib/server/services/users-service";

export async function load({ locals }) {

    // layer 1: Check if loggin in
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    // Get user details
    const fullUser = await usersService.getById(Number(locals.user.id));

    // layer 2: Check if admin role
    if (fullUser.role !== 'admin') {
        throw error(403, 'Admin access required');
    }

    return {
        user: locals.fullUser
    };
}