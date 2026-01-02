import { error, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getTabById } from '$lib/db/tab';
import { isFavorite, addFavorite, removeFavorite } from '$lib/db/favorite';
import { increaseViewCount } from '$lib/db/tab_summary';
import type { PageServerLoad, Actions } from './$types';

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
        if (!locals.user || tab.userId.toString() !== locals.user.id.toString()) {
            throw error(403, 'このTAB譜は非公開です');
        }
    }

    await increaseViewCount(tabId);

    let favorite = false;
    if (locals.user) {
        favorite = await isFavorite(tabId, new ObjectId(locals.user.id));
    }

    const canViewTex = tab.texPublicSetting === 'public' || 
                       (tab.texPublicSetting === 'login' && !!locals.user) || 
                       (locals.user && tab.userId.toString() === locals.user.id.toString());
    
    const canViewHistory = tab.historyPublicSetting === 'public' || 
                           (tab.historyPublicSetting === 'login' && !!locals.user) || 
                           (locals.user && tab.userId.toString() === locals.user.id.toString());

    return {
        tab: JSON.parse(JSON.stringify(tab)),
        user: locals.user,
        isFavorite: favorite,
        canViewTex,
        canViewHistory
    };
};

export const actions: Actions = {
    addFavorite: async ({ params, locals }) => {
        if (!locals.user) {
            throw redirect(303, '/login');
        }

        let tabId: ObjectId;
        try {
            tabId = new ObjectId(params.tabId);
        } catch (e) {
            throw error(404, 'TAB譜が見つかりません');
        }

        await addFavorite(tabId, new ObjectId(locals.user.id));
        return { success: true };
    },
    removeFavorite: async ({ params, locals }) => {
        if (!locals.user) {
            throw redirect(303, '/login');
        }

        let tabId: ObjectId;
        try {
            tabId = new ObjectId(params.tabId);
        } catch (e) {
            throw error(404, 'TAB譜が見つかりません');
        }

        await removeFavorite(tabId, new ObjectId(locals.user.id));
        return { success: true };
    }
};
