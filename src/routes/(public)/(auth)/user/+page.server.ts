import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { findUserById } from '$lib/db/user';
import { countPublicTabsByUserId } from '$lib/db/tab';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const userId = new ObjectId(locals.user.id);
    const user = await findUserById(userId);

    if (!user) {
        throw error(404, 'User not found');
    }

    const publicTabCount = await countPublicTabsByUserId(userId);

    return {
        user: {
            username: user.username,
            createdAt: user.createdAt
        },
        publicTabCount
    };
};
