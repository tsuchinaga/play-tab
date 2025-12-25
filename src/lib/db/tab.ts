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
