import { searchTabsAsAdmin } from '$lib/db/tab';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const name = url.searchParams.get('name') || '';
    const username = url.searchParams.get('username') || '';

    const tabs = await searchTabsAsAdmin({ name, username });

    return {
        tabs: JSON.parse(JSON.stringify(tabs)),
        searchParams: { name, username }
    };
};
