import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { createAdministrator, findAdministratorByLoginId } from '$lib/db/admin';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const loginId = formData.get('loginId') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!loginId || !password || !confirmPassword) {
            return fail(400, { message: 'すべての項目を入力してください', loginId });
        }

        if (password !== confirmPassword) {
            return fail(400, { message: 'パスワードが一致しません', loginId });
        }

        const existingAdmin = await findAdministratorByLoginId(loginId);
        if (existingAdmin) {
            return fail(400, { message: 'このログインIDは既に使用されています', loginId });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createAdministrator({ loginId, hashedPassword });

        throw redirect(303, '/controller/administrators');
    }
};
