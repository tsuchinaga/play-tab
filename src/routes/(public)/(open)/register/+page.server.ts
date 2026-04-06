import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { findUserByLoginId, createUser } from '$lib/db/user';
import { createEmailVerificationToken } from '$lib/db/emailVerification';
import { sendMail } from '$lib/server/mail';
import { env } from '$env/dynamic/private';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(303, '/');
    }
};

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const loginId = data.get('loginId') as string;
        const username = data.get('username') as string;
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const confirmPassword = data.get('confirmPassword') as string;

        if (!loginId || !username || !email || !password || !confirmPassword) {
            return fail(400, { loginId, username, email, error: 'すべての項目を入力してください' });
        }

        if (password !== confirmPassword) {
            return fail(400, { loginId, username, email, error: 'パスワードと確認用パスワードが一致しません' });
        }

        const existingUser = await findUserByLoginId(loginId);
        if (existingUser) {
            return fail(400, { loginId, username, email, error: 'このログインIDは既に使用されています' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await createUser({ loginId, username, email, hashedPassword });

        if (result.insertedId) {
            const { token, code } = await createEmailVerificationToken(result.insertedId);
            const verificationUrl = `${env.ORIGIN}/verify-email?token=${token}`;
            
            const subject = '【Play Tab】メールアドレスの確認';
            const text = `Play Tab をご利用いただきありがとうございます。
以下のURLにアクセスして、認証コードを入力し、メールアドレスの確認を完了してください。

認証コード: ${code}

${verificationUrl}

このURLの有効期限は24時間です。
もし、このメールに心当たりがない場合は、このメールを無視してください。`;

            const html = `
                <p>Play Tab をご利用いただきありがとうございます。</p>
                <p>以下のURLにアクセスして、認証コードを入力し、メールアドレスの確認を完了してください。</p>
                <p><strong>認証コード: ${code}</strong></p>
                <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                <p>このURLの有効期限は24時間です。</p>
                <hr>
                <p><small>もし、このメールに心当たりがない場合は、このメールを無視してください。</small></p>
            `;

            await sendMail(email, subject, text, html);
        }

        return { success: true };
    }
};
