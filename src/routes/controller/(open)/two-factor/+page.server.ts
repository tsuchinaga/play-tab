import { fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { Actions, PageServerLoad } from './$types';
import { findAdministratorById } from '$lib/db/admin';
import { getSession, updateSession } from '$lib/db/session';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    if (locals.admin) {
        throw redirect(303, '/controller/users');
    }

    const sessionId = cookies.get('sessionId');
    if (!sessionId) {
        throw redirect(303, '/controller/login');
    }

    const sessionData = await getSession(sessionId);
    if (!sessionData || !sessionData.tfa) {
        throw redirect(303, '/controller/login');
    }

    // 期限切れチェック
    if (Date.now() > sessionData.tfa.expiresAt) {
        throw redirect(303, '/controller/login');
    }
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const code = data.get('code') as string;

        if (!code) {
            return fail(400, { error: '認証コードを入力してください' });
        }

        const sessionId = cookies.get('sessionId');
        if (!sessionId) {
            throw redirect(303, '/controller/login');
        }

        const sessionData = await getSession(sessionId);
        if (!sessionData || !sessionData.tfa) {
            throw redirect(303, '/controller/login');
        }

        // 期限切れチェック
        if (Date.now() > sessionData.tfa.expiresAt) {
            return fail(400, { error: '認証コードの期限が切れています。再度ログインしてください。' });
        }

        // コード一致チェック
        if (code !== sessionData.tfa.code) {
            return fail(400, { error: '認証コードが正しくありません' });
        }

        // 認証成功：管理者情報をセッションにセットし、TFAデータを削除
        const admin = await findAdministratorById(new ObjectId(sessionData.tfa.adminId));
        if (!admin) {
            return fail(400, { error: '管理者が見つかりません' });
        }

        const adminData = {
            id: admin._id!.toString(),
            loginId: admin.loginId
        };

        const newSessionData = { ...sessionData, admin: adminData };
        delete newSessionData.tfa;

        await updateSession(sessionId, newSessionData);

        throw redirect(303, '/controller/users');
    }
};
