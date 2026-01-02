import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getTabById, getTabHistoriesByTabId } from '$lib/db/tab';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    let tabId: ObjectId;
    try {
        tabId = new ObjectId(params.tabId);
    } catch (e) {
        throw error(404, 'TAB譜が見つかりません');
    }

    const tab = await getTabById(tabId);

    if (!tab) {
        throw error(404, 'TAB譜が見つかりません');
    }

    // 公開設定のチェック
    const canViewHistory = tab.historyPublicSetting === 'public' || 
                           (tab.historyPublicSetting === 'login' && !!locals.user) || 
                           (locals.user && tab.userId.toString() === locals.user.id.toString());

    if (!canViewHistory) {
        throw error(403, 'バージョン履歴を閲覧する権限がありません');
    }

    const histories = await getTabHistoriesByTabId(tabId);

    return {
        tab: JSON.parse(JSON.stringify(tab)),
        histories: JSON.parse(JSON.stringify(histories))
    };
};
