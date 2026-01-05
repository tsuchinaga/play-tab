import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { findUserById } from '$lib/db/user';
import { ObjectId } from 'mongodb';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const user = await findUserById(new ObjectId(locals.user.id));
	if (!user || !user.isActive) {
		throw redirect(302, '/login');
	}

	return {
		user: locals.user
	};
};
