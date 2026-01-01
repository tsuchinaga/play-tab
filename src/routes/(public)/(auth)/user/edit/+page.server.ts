import { error, fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { findUserById, updateUser } from '$lib/db/user';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const userId = new ObjectId(locals.user.id);
    const user = await findUserById(userId);

    if (!user) {
        throw error(404, 'User not found');
    }

    return {
        user: {
            username: user.username
        }
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const data = await request.formData();
        const username = data.get('username') as string;
        const password = data.get('password') as string;
        const confirmPassword = data.get('confirmPassword') as string;

        if (!username) {
            return fail(400, { username, error: 'ユーザー名は必須です' });
        }

        const updateData: any = { username };

        if (password) {
            if (password !== confirmPassword) {
                return fail(400, { username, error: 'パスワードと確認用パスワードが一致しません' });
            }
            updateData.hashedPassword = await bcrypt.hash(password, 10);
        }

        const userId = new ObjectId(locals.user.id);
        await updateUser(userId, updateData);

        // ログイン中のユーザー名を更新するために locals を更新したいが、
        // 実際にはセッションなどで管理されているはずなので、ここではDB更新のみ。
        // リダイレクトして最新情報を表示させる。
        throw redirect(303, '/user');
    }
};
