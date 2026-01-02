import type { PageServerLoad } from './$types';
import { findRecentAnnouncements } from '$lib/db/announcement';

export const load: PageServerLoad = async ({ locals }) => {
    const announcements = await findRecentAnnouncements(5);
    return {
        user: locals.user,
        announcements: JSON.parse(JSON.stringify(announcements))
    };
};
