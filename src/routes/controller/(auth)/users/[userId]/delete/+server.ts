import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteUser, findUserById } from '$lib/db/user';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async ({ params }) => {
    let userId: ObjectId;
    try {
        userId = new ObjectId(params.userId);
    } catch (e) {
        throw error(400, '無効なユーザーIDです');
    }

    const user = await findUserById(userId);
    if (!user) {
        throw error(404, 'ユーザーが見つかりません');
    }

    let success = false;
    try {
        const result = await deleteUser(userId);
        success = result.modifiedCount === 1;
    } catch (e) {
        console.error(e);
    }

    if (success) {
        throw redirect(303, `/controller/users?success=deleted`);
    } else {
        throw redirect(303, `/controller/users?error=delete_failed&username=${encodeURIComponent(user.username)}`);
    }
};
