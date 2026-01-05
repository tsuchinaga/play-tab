import { error, fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { findAdministratorById, updateAdministrator } from '$lib/db/admin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    let adminId: ObjectId;
    try {
        adminId = new ObjectId(params.adminId);
    } catch (e) {
        throw error(400, 'Invalid administrator ID');
    }

    const admin = await findAdministratorById(adminId);
    if (!admin) {
        throw error(404, 'Administrator not found');
    }

    return {
        targetAdmin: JSON.parse(JSON.stringify(admin))
    };
};

export const actions: Actions = {
    update: async ({ params, request }) => {
        let adminId: ObjectId;
        try {
            adminId = new ObjectId(params.adminId);
        } catch (e) {
            return fail(400, { message: '不正なIDです' });
        }

        const formData = await request.formData();
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password || confirmPassword) {
            if (password !== confirmPassword) {
                return fail(400, { message: 'パスワードが一致しません' });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            await updateAdministrator(adminId, { hashedPassword });
        }

        throw redirect(303, '/controller/administrators');
    }
};
