import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/public';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
		PUBLIC_COPYRIGHT_HOLDER: env.PUBLIC_COPYRIGHT_HOLDER
	};
};
