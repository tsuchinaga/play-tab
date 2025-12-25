import { getDb } from './client';
import type { ObjectId } from 'mongodb';

export interface Track {
    name: string;
    instrument: string;
    tuning: string;
    isVisible: boolean;
    tex: string;
}

export interface Tab {
    _id?: ObjectId;
    userId: ObjectId;
    name: string;
    visibility: 'public' | 'unlisted' | 'private';
    bpm: number;
    tracks: Track[];
    createdAt: Date;
    updatedAt: Date;
}

export async function createTab(tab: Omit<Tab, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDb();
    const now = new Date();
    const result = await db.collection('tabs').insertOne({
        ...tab,
        createdAt: now,
        updatedAt: now
    });
    return result;
}

export async function getTabsByUserId(userId: ObjectId, query: { name?: string, visibility?: string } = {}) {
    const db = await getDb();
    const filter: any = { userId };

    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.visibility) {
        filter.visibility = query.visibility;
    }

    return await db.collection('tabs').find(filter).sort({ _id: 1 }).toArray();
}

export async function getTabById(id: ObjectId) {
    const db = await getDb();
    return await db.collection('tabs').findOne({ _id: id });
}

export async function updateTab(id: ObjectId, userId: ObjectId, tab: Omit<Tab, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const db = await getDb();
    const now = new Date();
    const result = await db.collection('tabs').updateOne(
        { _id: id, userId: userId },
        {
            $set: {
                ...tab,
                updatedAt: now
            }
        }
    );
    return result;
}

export async function deleteTab(id: ObjectId, userId: ObjectId) {
    const db = await getDb();
    const result = await db.collection('tabs').deleteOne({ _id: id, userId: userId });
    return result;
}
