import { fail, redirect } from '@sveltejs/kit';
import { createAnnouncement } from '$lib/db/announcement';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            return fail(400, { message: 'すべての項目を入力してください', title, content });
        }

        await createAnnouncement({ title, content });

        throw redirect(303, '/controller/announcements');
    }
};
