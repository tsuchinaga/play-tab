import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { findAdministratorByLoginId } from '$lib/db/admin';
import { createSession, getSession, updateSession } from '$lib/db/session';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.admin) {
        throw redirect(303, '/controller/home');
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

        const admin = await findAdministratorByLoginId(loginId);

        if (!admin) {
            return fail(401, { loginId, error: 'ログインIDまたはパスワードが正しくありません' });
        }

        const passwordMatch = await bcrypt.compare(password, admin.hashedPassword);

        if (!passwordMatch) {
            return fail(401, { loginId, error: 'ログインIDまたはパスワードが正しくありません' });
        }

        let sessionId = cookies.get('sessionId');
        const adminData = {
            id: admin._id.toString(),
            loginId: admin.loginId
        };

        if (sessionId) {
            const sessionData = await getSession(sessionId);
            if (sessionData) {
                // 既存のセッションがある場合は更新
                await updateSession(sessionId, { ...sessionData, admin: adminData });
            } else {
                // セッションIDはあるが無効な場合は新規作成
                sessionId = await createSession({ admin: adminData });
            }
        } else {
            // セッションIDがない場合は新規作成
            sessionId = await createSession({ admin: adminData });
        }

        cookies.set('sessionId', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        throw redirect(303, '/controller/home');
    }
};
