import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteTab, getTabById } from '$lib/db/tab';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        throw error(401, 'ログインが必要です');
    }

    let tabId: ObjectId;
    try {
        tabId = new ObjectId(params.tabId);
    } catch (e) {
        throw error(400, '無効なTAB譜IDです');
    }

    const tab = await getTabById(tabId);
    if (!tab) {
        throw redirect(303, `/tabs?error=delete_failed&name=unknown`);
    }

    if (tab.userId.toString() !== locals.user.id) {
        throw error(403, 'このTAB譜を削除する権限がありません');
    }

    let success = false;
    try {
        const result = await deleteTab(tabId, new ObjectId(locals.user.id));
        success = result.deletedCount === 1;
    } catch (e) {
        console.error(e);
    }

    if (success) {
        throw redirect(303, `/tabs?success=deleted`);
    } else {
        throw redirect(303, `/tabs?error=delete_failed&name=${encodeURIComponent(tab.name)}`);
    }
};
