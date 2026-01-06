import type { PageServerLoad } from './$types';
import { findAnnouncements } from '$lib/db/announcement';

export const load: PageServerLoad = async () => {
    const announcements = await findAnnouncements();
    return {
        announcements: JSON.parse(JSON.stringify(announcements))
    };
};
