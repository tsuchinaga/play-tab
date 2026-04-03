import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { hardDeleteUser, findUserById } from '$lib/db/user';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async ({ params }) => {
    let userId: ObjectId;
    try {
        userId = new ObjectId(params.userId);
    } catch (e) {
        throw error(400, '無効なユーザーIDです');
    }

    const user = await findUserById(userId, true);
    if (!user) {
        throw error(404, 'ユーザーが見つかりません');
    }

    let success = false;
    try {
        const result = await hardDeleteUser(userId);
        success = result.deletedCount === 1;
    } catch (e) {
        console.error(e);
    }

    if (success) {
        throw redirect(303, `/controller/users?success=hard_deleted`);
    } else {
        throw redirect(303, `/controller/users?error=hard_delete_failed&username=${encodeURIComponent(user.username)}`);
    }
};
