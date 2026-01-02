import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTabById, getTabHistoriesByTabId } from '$lib/db/tab';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ params, locals, url }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    let tabId: ObjectId;
    try {
        tabId = new ObjectId(params.tabId);
    } catch (e) {
        throw error(400, '無効なTAB譜IDです');
    }

    const tab = await getTabById(tabId);

    if (!tab) {
        throw error(404, 'TAB譜が見つかりません');
    }

    if (tab.userId.toString() !== locals.user.id) {
        throw error(403, 'このTAB譜の履歴を閲覧する権限がありません');
    }

    const sortBy = url.searchParams.get('sortBy') || undefined;
    const sortOrder = url.searchParams.get('sortOrder') as 'asc' | 'desc' || undefined;

    const histories = await getTabHistoriesByTabId(tabId, { sortBy, sortOrder });

    return {
        tab: JSON.parse(JSON.stringify(tab)),
        histories: JSON.parse(JSON.stringify(histories))
    };
};
