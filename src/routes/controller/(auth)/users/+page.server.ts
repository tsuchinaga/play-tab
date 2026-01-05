import { searchUsers } from '$lib/db/user';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const loginId = url.searchParams.get('loginId') || '';
    const username = url.searchParams.get('username') || '';
    const email = url.searchParams.get('email') || '';

    const users = await searchUsers({ loginId, username, email });

    return {
        users: JSON.parse(JSON.stringify(users)),
        searchParams: { loginId, username, email }
    };
};
