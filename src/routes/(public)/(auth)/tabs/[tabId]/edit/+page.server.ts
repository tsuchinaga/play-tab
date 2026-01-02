import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getTabById, updateTab } from '$lib/db/tab';
import type { Track } from '$lib/db/tab';
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
        throw error(403, 'このTAB譜を編集する権限がありません');
    }

    // ObjectId を文字列に変換してシリアライズ可能にする
    return {
        tab: JSON.parse(JSON.stringify(tab))
    };
};

export const actions: Actions = {
    default: async ({ request, params, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'ログインが必要です' });
        }

        let tabId: ObjectId;
        try {
            tabId = new ObjectId(params.tabId);
        } catch (e) {
            return fail(400, { message: '無効なTAB譜IDです' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const visibility = formData.get('visibility') as 'public' | 'unlisted' | 'private';
        const texPublicSetting = formData.get('texPublicSetting') as 'public' | 'login' | 'private';
        const historyPublicSetting = formData.get('historyPublicSetting') as 'public' | 'login' | 'private';
        const bpm = parseInt(formData.get('bpm') as string);
        const trackCount = parseInt(formData.get('trackCount') as string);
        const version = formData.get('version') as string || undefined;
        const versionComment = formData.get('versionComment') as string;

        const tracks: Track[] = [];
        for (let i = 0; i < trackCount; i++) {
            const trackName = formData.get(`trackName-${i}`) as string;
            const instrument = formData.get(`instrument-${i}`) as string;
            const tuning = formData.get(`tuning-${i}`) as string;
            const isVisible = formData.get(`isVisible-${i}`) === 'true';
            const tex = formData.get(`tex-${i}`) as string;

            tracks.push({
                name: trackName,
                instrument,
                tuning,
                isVisible,
                tex
            });
        }

        if (!name) {
            return fail(400, { message: '名前を入力してください', name, visibility, texPublicSetting, historyPublicSetting, bpm, trackCount, tracks });
        }

        let success = false;
        try {
            const result = await updateTab(
                tabId,
                new ObjectId(locals.user.id),
                {
                    name,
                    visibility,
                    texPublicSetting,
                    historyPublicSetting,
                    bpm,
                    tracks
                },
                versionComment,
                version
            );

            if (result.matchedCount === 0) {
                return fail(404, { message: 'TAB譜が見つからないか、編集権限がありません' });
            }
            success = true;
        } catch (e: any) {
            console.error(e);
            const message = e.message === 'DUPLICATE_VERSION' ? 'このバージョンは既に存在します' : '保存に失敗しました';
            return fail(e.message === 'DUPLICATE_VERSION' ? 400 : 500, { message, name, visibility, texPublicSetting, historyPublicSetting, bpm, trackCount, tracks });
        }

        if (success) {
            throw redirect(303, '/tabs');
        }
    }
};
