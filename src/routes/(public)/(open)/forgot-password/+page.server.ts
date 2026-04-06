import { fail } from '@sveltejs/kit';
import { findUserByLoginId } from '$lib/db/user';
import { createPasswordResetToken, deletePasswordResetTokensByUserId } from '$lib/db/passwordReset';
import { sendMail } from '$lib/server/mail';
import { env } from '$env/dynamic/private';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const loginId = data.get('loginId') as string;
        const email = data.get('email') as string;

        if (!loginId || !email) {
            return fail(400, { error: 'ユーザーIDとメールアドレスを入力してください。', loginId, email });
        }

        const user = await findUserByLoginId(loginId);
        if (!user || user.email !== email) {
            // セキュリティのため、ユーザーが見つからなくてもエラーは出さず、成功したふりをする
            return { success: true };
        }

        // 古いトークンがあれば削除
        await deletePasswordResetTokensByUserId(user._id!);

        // 新しいトークンを作成
        const token = await createPasswordResetToken(user._id!);

        // メール送信
        const resetLink = `${env.ORIGIN}/reset-password/${token}`;
        const subject = '【Play Tab】パスワード再設定のご案内';
        const text = `
${user.username} 様

いつも Play Tab をご利用いただきありがとうございます。
パスワードの再設定リクエストを受け付けました。

以下のリンクからパスワードの再設定を行ってください。
このリンクの有効期限は30分です。

${resetLink}

もしこのメールに心当たりがない場合は、このメールを破棄してください。
`.trim();

        try {
            await sendMail(user.email, subject, text);
        } catch (e) {
            console.error('Mail sending failed:', e);
            return fail(500, { error: 'メールの送信に失敗しました。時間をおいて再度お試しください。', loginId, email });
        }

        return { success: true };
    }
};
