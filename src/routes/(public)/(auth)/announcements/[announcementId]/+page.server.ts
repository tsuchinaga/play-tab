import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { findAnnouncementById } from '$lib/db/announcement';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ params }) => {
    let id: ObjectId;
    try {
        id = new ObjectId(params.announcementId);
    } catch (e) {
        throw error(400, 'Invalid announcement ID');
    }

    const announcement = await findAnnouncementById(id);
    if (!announcement) {
        throw error(404, 'Announcement not found');
    }

    return {
        announcement: JSON.parse(JSON.stringify(announcement))
    };
};
