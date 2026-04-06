import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { findEmailVerificationToken, deleteEmailVerificationToken } from '$lib/db/emailVerification';
import { updateUser } from '$lib/db/user';

export const load: PageServerLoad = async ({ url }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        return { error: 'トークンが指定されていません。' };
    }

    const verificationToken = await findEmailVerificationToken(token);

    if (!verificationToken) {
        return { error: '無効なトークンか、有効期限が切れています。' };
    }

    return { token };
};

export const actions: Actions = {
    default: async ({ request, url }) => {
        const token = url.searchParams.get('token');
        const data = await request.formData();
        const code = data.get('code') as string;

        if (!token) {
            return fail(400, { error: 'トークンが指定されていません。' });
        }

        if (!code) {
            return fail(400, { error: '認証コードを入力してください。' });
        }

        const verificationToken = await findEmailVerificationToken(token);

        if (!verificationToken) {
            return fail(400, { error: '無効なトークンか、有効期限が切れています。' });
        }

        if (verificationToken.code !== code) {
            return fail(400, { error: '認証コードが正しくありません。' });
        }

        // ユーザーの確認フラグを更新し、有効期限を解除
        await updateUser(verificationToken.userId, { isEmailVerified: true, expiresAt: null });

        // トークンを削除
        await deleteEmailVerificationToken(token);

        return { success: true };
    }
};
