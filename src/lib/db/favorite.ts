import { getDb } from './client';
import { ObjectId } from 'mongodb';

export async function isFavorite(tabId: ObjectId, userId: ObjectId): Promise<boolean> {
    const db = await getDb();
    const favorite = await db.collection('favorite_tabs').findOne({
        tabId,
        userId
    });
    return !!favorite;
}

export async function addFavorite(tabId: ObjectId, userId: ObjectId): Promise<void> {
    const db = await getDb();
    await db.collection('favorite_tabs').insertOne({
        tabId,
        userId,
        createdAt: new Date()
    });
}

export async function removeFavorite(tabId: ObjectId, userId: ObjectId): Promise<void> {
    const db = await getDb();
    await db.collection('favorite_tabs').deleteOne({
        tabId,
        userId
    });
}

export async function getFavoriteTabsByUserId(
    userId: ObjectId,
    query: {
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    } = {}
) {
    const db = await getDb();
    const { sortBy = 'favoritedAt', sortOrder = 'desc' } = query;

    const sortMap: Record<string, string> = {
        name: 'tab.name',
        username: 'creator.username',
        updatedAt: 'tab.updatedAt',
        favoritedAt: 'createdAt'
    };

    const sortField = sortMap[sortBy] || 'createdAt';
    const sortValue = sortOrder === 'asc' ? 1 : -1;

    const pipeline: any[] = [
        { $match: { userId } },
        {
            $lookup: {
                from: 'tabs',
                localField: 'tabId',
                foreignField: '_id',
                as: 'tab'
            }
        },
        { $unwind: '$tab' },
        {
            $lookup: {
                from: 'users',
                localField: 'tab.userId',
                foreignField: '_id',
                as: 'creator'
            }
        },
        { $unwind: '$creator' },
        {
            $sort: { [sortField]: sortValue }
        }
    ];

    return await db.collection('favorite_tabs').aggregate(pipeline).toArray();
}
