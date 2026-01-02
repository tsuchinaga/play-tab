import type { ObjectId } from 'mongodb';
import { getDb } from './client';

export interface Announcement {
    _id?: ObjectId;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function findRecentAnnouncements(limit: number = 5) {
    const db = await getDb();
    return await db.collection<Announcement>('announcements')
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
}

export async function findAllAnnouncements() {
    const db = await getDb();
    return await db.collection<Announcement>('announcements')
        .find()
        .sort({ createdAt: -1 })
        .toArray();
}

export async function findAnnouncementById(id: ObjectId) {
    const db = await getDb();
    return await db.collection<Announcement>('announcements').findOne({ _id: id });
}
