import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { findUserByLoginId, createUser } from '$lib/db/user';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(303, '/home');
    }
};

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const loginId = data.get('loginId') as string;
        const username = data.get('username') as string;
        const password = data.get('password') as string;
        const confirmPassword = data.get('confirmPassword') as string;

        if (!loginId || !username || !password || !confirmPassword) {
            return fail(400, { loginId, username, error: 'すべての項目を入力してください' });
        }

        if (password !== confirmPassword) {
            return fail(400, { loginId, username, error: 'パスワードと確認用パスワードが一致しません' });
        }

        const existingUser = await findUserByLoginId(loginId);
        if (existingUser) {
            return fail(400, { loginId, username, error: 'このログインIDは既に使用されています' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser({ loginId, username, hashedPassword });

        throw redirect(303, '/login');
    }
};
