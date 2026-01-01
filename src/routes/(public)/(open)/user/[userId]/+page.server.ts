import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { findUserById } from '$lib/db/user';
import { countPublicTabsByUserId } from '$lib/db/tab';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    let userId: ObjectId;
    try {
        userId = new ObjectId(params.userId);
    } catch (e) {
        throw error(400, 'Invalid User ID');
    }

    const user = await findUserById(userId);

    if (!user) {
        throw error(404, 'User not found');
    }

    const publicTabCount = await countPublicTabsByUserId(userId);

    return {
        profileUser: {
            username: user.username,
            createdAt: user.createdAt
        },
        publicTabCount
    };
};
