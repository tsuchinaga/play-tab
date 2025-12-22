import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.admin) {
        throw redirect(302, '/controller/login');
    }
    return {
        admin: locals.admin
    };
};
