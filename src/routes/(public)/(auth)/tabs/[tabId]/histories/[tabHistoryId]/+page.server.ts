import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTabById, getTabHistoryByVersion } from '$lib/db/tab';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ params, locals }) => {
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
        throw error(403, 'このTAB譜を閲覧する権限がありません');
    }

    const history = await getTabHistoryByVersion(tabId, params.tabHistoryId);
    if (!history) {
        throw error(404, '指定されたバージョンの履歴が見つかりません');
    }

    return {
        tab: JSON.parse(JSON.stringify(tab)),
        history: JSON.parse(JSON.stringify(history))
    };
};
