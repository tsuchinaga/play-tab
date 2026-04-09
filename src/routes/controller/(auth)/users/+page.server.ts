import { searchUsers } from '$lib/db/user';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const loginId = url.searchParams.get('loginId') || '';
    const username = url.searchParams.get('username') || '';
    const email = url.searchParams.get('email') || '';
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    const isEmailVerifiedParam = url.searchParams.get('isEmailVerified');
    const isEmailVerified = isEmailVerifiedParam === 'true' ? true : isEmailVerifiedParam === 'false' ? false : undefined;

    const users = await searchUsers({ loginId, username, email, includeDeleted, isEmailVerified });

    const success = url.searchParams.get('success');
    const errorParam = url.searchParams.get('error');
    let message = '';
    let messageType = '';

    if (success === 'deleted') {
        message = 'ユーザーを削除しました。';
        messageType = 'success';
    } else if (success === 'hard_deleted') {
        message = 'ユーザーを完全に削除しました。';
        messageType = 'success';
    } else if (errorParam === 'delete_failed') {
        const failedUsername = url.searchParams.get('username') || '不明';
        message = `ユーザー「${failedUsername}」の削除に失敗しました。`;
        messageType = 'error';
    } else if (errorParam === 'hard_delete_failed') {
        const failedUsername = url.searchParams.get('username') || '不明';
        message = `ユーザー「${failedUsername}」の完全削除に失敗しました。`;
        messageType = 'error';
    }

    return {
        users: JSON.parse(JSON.stringify(users)),
        searchParams: { loginId, username, email, includeDeleted, isEmailVerified },
        message,
        messageType
    };
};
