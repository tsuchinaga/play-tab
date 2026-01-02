import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getTabById, getTabHistoryByVersion } from '$lib/db/tab';
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

    // 公開設定のチェック (最新の公開設定に従う)
    const canViewHistory = tab.historyPublicSetting === 'public' || 
                           (tab.historyPublicSetting === 'login' && !!locals.user) || 
                           (locals.user && tab.userId.toString() === locals.user.id.toString());

    if (!canViewHistory) {
        throw error(403, 'バージョン履歴を閲覧する権限がありません');
    }

    const history = await getTabHistoryByVersion(tabId, params.version);

    if (!history) {
        throw error(404, '指定されたバージョンの履歴が見つかりません');
    }

    const canViewTex = tab.texPublicSetting === 'public' || 
                       (tab.texPublicSetting === 'login' && !!locals.user) || 
                       (locals.user && tab.userId.toString() === locals.user.id.toString());

    return {
        tab: JSON.parse(JSON.stringify(tab)), // 最新の情報（ユーザー情報などを含む）
        history: JSON.parse(JSON.stringify(history)), // 指定バージョンの情報
        user: locals.user,
        canViewTex,
        canViewHistory
    };
};
