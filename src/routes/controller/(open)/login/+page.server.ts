import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { findAdministratorByLoginId } from '$lib/db/admin';
import { createSession, getSession, updateSession } from '$lib/db/session';
import { sendMail } from '$lib/server/mail';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.admin) {
        throw redirect(303, '/controller/users');
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

        // 2段階認証コード生成 (6桁の数字)
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 認証コードをメール送信
        try {
            await sendMail(
                admin.email,
                '【Play Tab】管理者ログイン認証コード',
                `管理者ログインのための認証コードは ${code} です。`
            );
        } catch (e) {
            console.error('Failed to send 2FA mail:', e);
            return fail(500, { loginId, error: '認証メールの送信に失敗しました。管理者にお問い合わせください。' });
        }

        // 2段階認証用の一時セッションデータ
        const tfaData = {
            adminId: admin._id.toString(),
            code,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10分
        };

        let sessionId = cookies.get('sessionId');
        if (sessionId) {
            const sessionData = await getSession(sessionId);
            if (sessionData) {
                // TFAデータのみセット
                await updateSession(sessionId, { ...sessionData, tfa: tfaData });
            } else {
                sessionId = await createSession({ tfa: tfaData });
            }
        } else {
            sessionId = await createSession({ tfa: tfaData });
        }

        cookies.set('sessionId', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        throw redirect(303, '/controller/two-factor');
    }
};
