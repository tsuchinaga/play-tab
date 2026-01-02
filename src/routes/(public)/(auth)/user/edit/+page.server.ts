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
            username: user.username,
            email: user.email,
            registeredTabsVisibility: user.registeredTabsVisibility,
            favoritedTabsVisibility: user.favoritedTabsVisibility
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
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const confirmPassword = data.get('confirmPassword') as string;
        const registeredTabsVisibility = data.get('registeredTabsVisibility') as 'private' | 'logged_in' | 'public';
        const favoritedTabsVisibility = data.get('favoritedTabsVisibility') as 'private' | 'logged_in' | 'public';

        if (!username) {
            return fail(400, { username, email, error: 'ユーザー名は必須です' });
        }
        if (!email) {
            return fail(400, { username, email, error: 'メールアドレスは必須です' });
        }

        const updateData: any = {
            username,
            email,
            registeredTabsVisibility,
            favoritedTabsVisibility
        };

        if (password) {
            if (password !== confirmPassword) {
                return fail(400, { username, email, error: 'パスワードと確認用パスワードが一致しません' });
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
