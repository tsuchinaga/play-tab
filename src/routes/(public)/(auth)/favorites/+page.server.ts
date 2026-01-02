import type { PageServerLoad, Actions } from './$types';
import { getFavoriteTabsByUserId, removeFavorite } from '$lib/db/favorite';
import { ObjectId } from 'mongodb';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const userId = new ObjectId(locals.user.id);
    const sortBy = url.searchParams.get('sortBy') || 'favoritedAt';
    const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    const favorites = await getFavoriteTabsByUserId(userId, { sortBy, sortOrder });

    return {
        favorites: favorites.map(f => ({
            id: f.tabId.toString(),
            name: f.tab.name,
            creatorId: f.creator._id.toString(),
            creatorName: f.creator.username,
            updatedAt: f.tab.updatedAt,
            favoritedAt: f.createdAt
        })),
        sortBy,
        sortOrder
    };
};

export const actions: Actions = {
    removeFavorite: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'ログインが必要です');
        }

        const data = await request.formData();
        const tabIdStr = data.get('tabId') as string;

        if (!tabIdStr) {
            throw error(400, 'TAB譜IDが必要です');
        }

        try {
            const tabId = new ObjectId(tabIdStr);
            const userId = new ObjectId(locals.user.id);
            await removeFavorite(tabId, userId);
        } catch (e) {
            throw error(400, '不正なTAB譜IDです');
        }

        return { success: true };
    }
};
