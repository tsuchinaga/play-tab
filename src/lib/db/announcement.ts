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

export async function findAnnouncements(query: { title?: string } = {}) {
    const db = await getDb();
    const filter: any = {};
    if (query.title) {
        filter.title = { $regex: query.title, $options: 'i' };
    }
    return await db.collection<Announcement>('announcements')
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();
}

export async function createAnnouncement(announcement: Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDb();
    const now = new Date();
    const result = await db.collection<Announcement>('announcements').insertOne({
        ...announcement,
        createdAt: now,
        updatedAt: now
    });
    return result.insertedId;
}

export async function updateAnnouncement(id: ObjectId, announcement: Partial<Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>>) {
    const db = await getDb();
    await db.collection<Announcement>('announcements').updateOne(
        { _id: id },
        {
            $set: {
                ...announcement,
                updatedAt: new Date()
            }
        }
    );
}

export async function deleteAnnouncement(id: ObjectId) {
    const db = await getDb();
    await db.collection<Announcement>('announcements').deleteOne({ _id: id });
}

export async function findAnnouncementById(id: ObjectId) {
    const db = await getDb();
    return await db.collection<Announcement>('announcements').findOne({ _id: id });
}
