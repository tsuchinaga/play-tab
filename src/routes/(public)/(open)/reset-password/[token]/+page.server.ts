import { fail, redirect } from '@sveltejs/kit';
import { findPasswordResetToken, deletePasswordResetToken } from '$lib/db/passwordReset';
import { updateUser } from '$lib/db/user';
import bcrypt from 'bcrypt';

export const load = async ({ params }) => {
    const { token } = params;
    const resetToken = await findPasswordResetToken(token);

    if (!resetToken) {
        return { error: '無効なトークンか、有効期限が切れています。再度パスワード再発行の手続きを行ってください。' };
    }

    return { token };
};

export const actions = {
    default: async ({ params, request }) => {
        const { token } = params;
        const data = await request.formData();
        const password = data.get('password') as string;
        const passwordConfirm = data.get('passwordConfirm') as string;

        if (!password || !passwordConfirm) {
            return fail(400, { error: 'すべての項目を入力してください。' });
        }

        if (password !== passwordConfirm) {
            return fail(400, { error: 'パスワードが一致しません。' });
        }

        if (password.length < 8) {
            return fail(400, { error: 'パスワードは8文字以上で入力してください。' });
        }

        const resetToken = await findPasswordResetToken(token);
        if (!resetToken) {
            return fail(400, { error: '無効なトークンか、有効期限が切れています。' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUser(resetToken.userId, { hashedPassword });

        // 使用済みトークンを削除
        await deletePasswordResetToken(token);

        throw redirect(303, '/login?message=password_updated');
    }
};
