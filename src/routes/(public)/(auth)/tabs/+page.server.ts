import type { PageServerLoad } from './$types';
import { getTabsByUserId } from '$lib/db/tab';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ locals, url }) => {
    const userId = new ObjectId(locals.user!.id);
    const name = url.searchParams.get('name') || undefined;
    const visibility = url.searchParams.get('status') || undefined;

    const tabs = await getTabsByUserId(userId, { name, visibility });

    return {
        tabs: tabs.map(tab => ({
            id: tab._id!.toString(),
            name: tab.name,
            status: tab.visibility,
            createdAt: tab.createdAt,
            views: (tab as any).views ?? null,
            rating: (tab as any).rating ?? null
        }))
    };
};
