import { findUserById, updateUser } from '$lib/db/user';
import { error, fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { Actions, PageServerLoad } from './$types';

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

    return {
        targetUser: JSON.parse(JSON.stringify(user))
    };
};

export const actions: Actions = {
    default: async ({ params, request }) => {
        let userId: ObjectId;
        try {
            userId = new ObjectId(params.userId);
        } catch (e) {
            throw error(400, 'Invalid user ID');
        }

        const data = await request.formData();
        const isActive = data.get('isActive') === 'true';

        try {
            await updateUser(userId, { isActive });
        } catch (e) {
            return fail(500, { message: 'Failed to update user' });
        }

        throw redirect(303, '/controller/users');
    }
};
