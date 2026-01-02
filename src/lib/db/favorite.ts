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
