import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { findUserById } from '$lib/db/user';
import { countPublicTabsByUserId, getTabsByUserId } from '$lib/db/tab';
import { countFavoriteTabsByUserId, getFavoriteTabsByUserId } from '$lib/db/favorite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    let userId: ObjectId;
    try {
        userId = new ObjectId(params.userId);
    } catch (e) {
        throw error(400, 'Invalid User ID');
    }

    const user = await findUserById(userId);

    if (!user) {
        throw error(404, 'User not found');
    }

    const isLogin = !!locals.user;
    const publicTabCount = await countPublicTabsByUserId(userId);
    const favoriteCount = await countFavoriteTabsByUserId(userId);

    let registeredTabs = [];
    if (user.registeredTabsVisibility === 'public' || (user.registeredTabsVisibility === 'logged_in' && isLogin)) {
        registeredTabs = await getTabsByUserId(userId, { visibility: 'public', sortBy: 'updatedAt', sortOrder: 'desc', limit: 5 });
    }

    let favoriteTabs = [];
    if (user.favoritedTabsVisibility === 'public' || (user.favoritedTabsVisibility === 'logged_in' && isLogin)) {
        favoriteTabs = await getFavoriteTabsByUserId(userId, { sortBy: '_id', sortOrder: 'desc', limit: 5 });
    }

    return {
        profileUser: {
            username: user.username,
            createdAt: user.createdAt,
            registeredTabsVisibility: user.registeredTabsVisibility,
            favoritedTabsVisibility: user.favoritedTabsVisibility
        },
        publicTabCount,
        favoriteCount,
        registeredTabs: registeredTabs.map(tab => ({
            _id: tab._id.toString(),
            name: tab.name,
            instruments: tab.instruments,
            updatedAt: tab.updatedAt
        })),
        favoriteTabs: favoriteTabs.map(f => ({
            _id: f.tab._id.toString(),
            name: f.tab.name,
            creator: {
                _id: f.creator._id.toString(),
                username: f.creator.username
            },
            instruments: f.tab.instruments,
            updatedAt: f.tab.updatedAt
        }))
    };
};
