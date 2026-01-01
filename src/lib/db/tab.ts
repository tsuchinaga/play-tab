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
    version: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TabHistory extends Omit<Tab, '_id'> {
    _id?: ObjectId;
    tabId: ObjectId;
    version_comment: string;
}

async function getNextVersion(tabId?: ObjectId) {
    const db = await getDb();
    const now = new Date();
    const yyyymmdd = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0');

    let nextNumber = 1;

    if (tabId) {
        const lastHistory = await db.collection('tab_histories')
            .find({ tabId, version: { $regex: `^${yyyymmdd}-` } })
            .sort({ version: -1 })
            .limit(1)
            .toArray();

        if (lastHistory.length > 0) {
            const lastVersion = lastHistory[0].version;
            const lastNumber = parseInt(lastVersion.split('-')[1]);
            nextNumber = lastNumber + 1;
        }
    }

    return `${yyyymmdd}-${nextNumber.toString().padStart(3, '0')}`;
}

export async function createTab(tab: Omit<Tab, '_id' | 'createdAt' | 'updatedAt' | 'version'>, versionComment: string = '新規登録', version?: string) {
    const db = await getDb();
    const now = new Date();
    const finalVersion = version || await getNextVersion();

    const tabData = {
        ...tab,
        version: finalVersion,
        createdAt: now,
        updatedAt: now
    };

    const result = await db.collection('tabs').insertOne(tabData);
    const tabId = result.insertedId;

    await db.collection('tab_histories').insertOne({
        ...tabData,
        tabId,
        version_comment: versionComment
    });

    return result;
}

export async function getTabsByUserId(userId: ObjectId, query: { name?: string, visibility?: string, sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}) {
    const db = await getDb();
    const filter: any = { userId };

    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.visibility) {
        filter.visibility = query.visibility;
    }

    const sort: any = {};
    if (query.sortBy === 'visibility') {
        const order = query.sortOrder === 'desc' ? -1 : 1;
        return await db.collection('tabs').aggregate([
            { $match: filter },
            {
                $addFields: {
                    visibilityOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$visibility', 'public'] }, then: 1 },
                                { case: { $eq: ['$visibility', 'unlisted'] }, then: 2 },
                                { case: { $eq: ['$visibility', 'private'] }, then: 3 }
                            ],
                            default: 4
                        }
                    }
                }
            },
            { $sort: { visibilityOrder: order as 1 | -1, _id: 1 } }
        ]).toArray();
    }

    if (query.sortBy) {
        sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
    } else {
        sort._id = 1;
    }

    return await db.collection('tabs').find(filter).sort(sort).toArray();
}

export async function getTabById(id: ObjectId) {
    const db = await getDb();
    return await db.collection('tabs').findOne({ _id: id });
}

export async function updateTab(id: ObjectId, userId: ObjectId, tab: Omit<Tab, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'version'>, versionComment: string, version?: string) {
    const db = await getDb();
    const now = new Date();
    const finalVersion = version || await getNextVersion(id);

    // バージョンの重複チェック
    const existingHistory = await db.collection('tab_histories').findOne({
        tabId: id,
        version: finalVersion
    });

    if (existingHistory) {
        throw new Error('DUPLICATE_VERSION');
    }

    const result = await db.collection('tabs').updateOne(
        { _id: id, userId: userId },
        {
            $set: {
                ...tab,
                version: finalVersion,
                updatedAt: now
            }
        }
    );

    if (result.matchedCount > 0) {
        const currentTab = await db.collection('tabs').findOne({ _id: id });
        if (currentTab) {
            const { _id, ...historyData } = currentTab;
            await db.collection('tab_histories').insertOne({
                ...historyData,
                tabId: id,
                version_comment: versionComment
            });
        }
    }

    return result;
}

export async function deleteTab(id: ObjectId, userId: ObjectId) {
    const db = await getDb();
    const result = await db.collection('tabs').deleteOne({ _id: id, userId: userId });
    return result;
}

export async function getTabHistoriesByTabId(tabId: ObjectId, query: { sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}) {
    const db = await getDb();
    const sort: any = {};
    if (query.sortBy) {
        sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
    } else {
        sort.version = -1;
    }

    return await db.collection('tab_histories')
        .find({ tabId })
        .sort(sort)
        .toArray() as unknown as TabHistory[];
}

export async function getTabHistoryByVersion(tabId: ObjectId, version: string) {
    const db = await getDb();
    return await db.collection('tab_histories')
        .findOne({ tabId, version }) as unknown as TabHistory | null;
}
