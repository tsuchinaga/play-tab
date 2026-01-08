import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSession, updateSession } from '$lib/db/session';

export const load: PageServerLoad = async () => {
    // ログアウトページに直接アクセスした場合はユーザー管理へリダイレクト
    throw redirect(303, '/controller/users');
};

export const actions: Actions = {
    default: async ({ cookies }) => {
        const sessionId = cookies.get('sessionId');
        if (sessionId) {
            // 現在のセッションデータを取得
            const sessionData = await getSession(sessionId);
            if (sessionData) {
                // admin情報を削除した新しいデータを作成
                const { admin, ...otherData } = sessionData;
                // DBのセッションデータを更新
                await updateSession(sessionId, otherData);
            }
        }

        // ログインページへリダイレクト
        throw redirect(303, '/controller/login');
    }
};
