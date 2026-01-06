import { findAnnouncements, deleteAnnouncement } from '$lib/db/announcement';
import { ObjectId } from 'mongodb';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const title = url.searchParams.get('title') || undefined;
    const announcements = await findAnnouncements({ title });

    return {
        announcements: JSON.parse(JSON.stringify(announcements)),
        searchParams: { title }
    };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        if (id) {
            await deleteAnnouncement(new ObjectId(id));
        }
        return { success: true };
    }
};
