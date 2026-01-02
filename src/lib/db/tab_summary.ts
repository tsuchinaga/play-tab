import { getDb } from './client';
import { ObjectId } from 'mongodb';

export interface TabSummary {
    _id?: ObjectId;
    tabId: ObjectId;
    viewCount: number;
    favoriteCount: number;
}

export async function createTabSummary(tabId: ObjectId): Promise<void> {
    const db = await getDb();
    const existing = await db.collection('tab_summaries').findOne({ tabId });
    if (!existing) {
        await db.collection('tab_summaries').insertOne({
            tabId,
            viewCount: 0,
            favoriteCount: 0
        });
    }
}

export async function increaseViewCount(tabId: ObjectId): Promise<void> {
    const db = await getDb();
    await db.collection('tab_summaries').updateOne(
        { tabId },
        { 
            $inc: { viewCount: 1 },
            $setOnInsert: { favoriteCount: 0 }
        },
        { upsert: true }
    );
}

export async function increaseFavoriteCount(tabId: ObjectId): Promise<void> {
    const db = await getDb();
    await db.collection('tab_summaries').updateOne(
        { tabId },
        { 
            $inc: { favoriteCount: 1 },
            $setOnInsert: { viewCount: 0 }
        },
        { upsert: true }
    );
}

export async function decreaseFavoriteCount(tabId: ObjectId): Promise<void> {
    const db = await getDb();
    await db.collection('tab_summaries').updateOne(
        { tabId },
        { 
            $inc: { favoriteCount: -1 },
            $setOnInsert: { viewCount: 0 }
        },
        { upsert: true }
    );
}
