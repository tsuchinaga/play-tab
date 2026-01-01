import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getTabById } from '$lib/db/tab';
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

    // 公開設定のチェック (public または unlisted のみ表示可能)
    if (tab.visibility === 'private') {
        if (!locals.user || tab.userId.toString() !== locals.user._id.toString()) {
            throw error(403, 'このTAB譜は非公開です');
        }
    }

    return {
        tab: JSON.parse(JSON.stringify(tab)),
        user: locals.user
    };
};
