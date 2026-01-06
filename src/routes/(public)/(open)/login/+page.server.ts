import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { findUserByLoginId } from '$lib/db/user';
import { createSession, getSession, updateSession } from '$lib/db/session';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(303, '/');
    }
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const loginId = data.get('loginId') as string;
        const password = data.get('password') as string;

        if (!loginId || !password) {
            return fail(400, { loginId, error: 'ログインIDとパスワードを入力してください' });
        }

        const user = await findUserByLoginId(loginId);

        if (!user) {
            return fail(401, { loginId, error: 'ログインIDまたはパスワードが正しくありません' });
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordMatch) {
            return fail(401, { loginId, error: 'ログインIDまたはパスワードが正しくありません' });
        }

        if (!user.isActive) {
            return fail(401, { loginId, error: 'ログインIDまたはパスワードが正しくありません' });
        }

        let sessionId = cookies.get('sessionId');
        const userData = {
            id: user._id.toString(),
            loginId: user.loginId,
            username: user.username
        };

        if (sessionId) {
            const sessionData = await getSession(sessionId);
            if (sessionData) {
                // 既存のセッションがある場合は更新
                await updateSession(sessionId, { ...sessionData, user: userData });
            } else {
                // セッションIDはあるが無効な場合は新規作成
                sessionId = await createSession({ user: userData });
            }
        } else {
            // セッションIDがない場合は新規作成
            sessionId = await createSession({ user: userData });
        }

        cookies.set('sessionId', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        throw redirect(303, '/home');
    }
};
