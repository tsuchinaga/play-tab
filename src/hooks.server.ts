import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/db/session';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('sessionId');

	if (sessionId) {
		const sessionData = await getSession(sessionId);
		if (sessionData) {
			event.locals.admin = sessionData.admin;
		}
	}

	return resolve(event);
};
