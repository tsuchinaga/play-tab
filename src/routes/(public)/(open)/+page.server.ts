import { getRecentPublicTabs, getTopFavoritedPublicTabs } from '$lib/db/tab';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const recentTabs = await getRecentPublicTabs(5);
    const topFavoritedTabs = await getTopFavoritedPublicTabs(5);

    return {
        recentTabs: JSON.parse(JSON.stringify(recentTabs)),
        topFavoritedTabs: JSON.parse(JSON.stringify(topFavoritedTabs))
    };
};
