import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { findUserById } from '$lib/db/user';
import { getTabsByUserId } from '$lib/db/tab';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    let userId: ObjectId;
    try {
        userId = new ObjectId(params.userId);
    } catch (e) {
        throw error(400, 'Invalid user ID');
    }

    const user = await findUserById(userId);
    if (!user) {
        throw error(404, 'User not found');
    }

    const tabs = await getTabsByUserId(userId, {});

    return {
        targetUser: JSON.parse(JSON.stringify(user)),
        tabs: JSON.parse(JSON.stringify(tabs))
    };
};
