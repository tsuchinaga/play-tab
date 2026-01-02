import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createTab } from '$lib/db/tab';
import type { Track } from '$lib/db/tab';
import { ObjectId } from 'mongodb';

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'ログインが必要です' });
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

        try {
            await createTab({
                userId: new ObjectId(locals.user.id),
                name,
                visibility,
                texPublicSetting,
                historyPublicSetting,
                bpm,
                tracks
            }, versionComment, version);
        } catch (e: any) {
            console.error(e);
            const message = e.message === 'DUPLICATE_VERSION' ? 'このバージョンは既に存在します' : '保存に失敗しました';
            return fail(e.message === 'DUPLICATE_VERSION' ? 400 : 500, { message, name, visibility, texPublicSetting, historyPublicSetting, bpm, trackCount, tracks, versionComment });
        }

        throw redirect(303, '/tabs');
    }
};
