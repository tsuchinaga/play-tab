import type { PageServerLoad } from './$types';
import { getTabsByUserId } from '$lib/db/tab';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ locals, url }) => {
    const userId = new ObjectId(locals.user!.id);
    const name = url.searchParams.get('name') || undefined;
    const visibility = url.searchParams.get('status') || undefined;
    const sortBy = url.searchParams.get('sortBy') || undefined;
    const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || undefined;

    const tabs = await getTabsByUserId(userId, { name, visibility, sortBy, sortOrder });

    const success = url.searchParams.get('success');
    const error = url.searchParams.get('error');
    const targetName = url.searchParams.get('name');
    let message = '';
    let messageType: 'success' | 'error' | '' = '';

    if (success === 'deleted') {
        message = 'TAB譜を削除しました。';
        messageType = 'success';
    } else if (error === 'delete_failed') {
        message = `TAB譜「${targetName}」の削除に失敗しました。`;
        messageType = 'error';
    }

    return {
        tabs: tabs.map(tab => ({
            id: tab._id!.toString(),
            name: tab.name,
            status: tab.visibility,
            version: tab.version,
            updatedAt: tab.updatedAt,
            viewCount: (tab as any).viewCount ?? 0,
            favoriteCount: (tab as any).favoriteCount ?? 0
        })),
        message,
        messageType
    };
};
