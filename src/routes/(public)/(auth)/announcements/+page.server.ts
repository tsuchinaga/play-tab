import type { PageServerLoad } from './$types';
import { findAllAnnouncements } from '$lib/db/announcement';

export const load: PageServerLoad = async () => {
    const announcements = await findAllAnnouncements();
    return {
        announcements: JSON.parse(JSON.stringify(announcements))
    };
};
