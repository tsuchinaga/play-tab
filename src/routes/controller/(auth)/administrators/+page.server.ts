import { fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getAllAdministrators, deleteAdministrator } from '$lib/db/admin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    const administrators = await getAllAdministrators();

    return {
        administrators: JSON.parse(JSON.stringify(administrators))
    };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const formData = await request.formData();
        const adminIdStr = formData.get('adminId') as string;

        let adminId: ObjectId;
        try {
            adminId = new ObjectId(adminIdStr);
        } catch (e) {
            return fail(400, { message: '不正なIDです' });
        }

        await deleteAdministrator(adminId);
        throw redirect(303, '/controller/administrators');
    }
};
