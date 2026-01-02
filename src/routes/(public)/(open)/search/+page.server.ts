import { searchPublicTabs } from '$lib/db/tab';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const name = url.searchParams.get('name') || undefined;
    const instruments = url.searchParams.getAll('instruments');
    
    const tabs = await searchPublicTabs({
        name,
        instruments: instruments.length > 0 ? instruments : undefined,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
    });

    return {
        tabs: JSON.parse(JSON.stringify(tabs)),
        searchParams: {
            name: name || '',
            instruments
        }
    };
};
