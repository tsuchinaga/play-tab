import { error, fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { findAnnouncementById, updateAnnouncement } from '$lib/db/announcement';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    let id: ObjectId;
    try {
        id = new ObjectId(params.id);
    } catch (e) {
        throw error(400, 'Invalid ID');
    }

    const announcement = await findAnnouncementById(id);
    if (!announcement) {
        throw error(404, 'Not found');
    }

    return {
        announcement: JSON.parse(JSON.stringify(announcement))
    };
};

export const actions: Actions = {
    default: async ({ params, request }) => {
        let id: ObjectId;
        try {
            id = new ObjectId(params.id);
        } catch (e) {
            return fail(400, { message: 'Invalid ID' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            return fail(400, { message: 'すべての項目を入力してください', title, content });
        }

        await updateAnnouncement(id, { title, content });

        throw redirect(303, '/controller/announcements');
    }
};
