import { getDb } from './client';
import type { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { createTabSummary } from './tab_summary';
import { getCoarseInstruments } from '../instruments';

let ALPHA_TAB_VERSION = 'unknown';
try {
    const pkgPath = path.resolve('node_modules/@coderline/alphatab/package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    ALPHA_TAB_VERSION = pkg.version;
} catch (e) {
    console.error('Failed to get alphaTab version:', e);
}

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
    texPublicSetting: 'private' | 'login' | 'public';
    historyPublicSetting: 'private' | 'login' | 'public';
    bpm: number;
    tracks: Track[];
    instruments: string[];
    alphaTabVersion: string;
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

export async function createTab(tab: Omit<Tab, '_id' | 'createdAt' | 'updatedAt' | 'version' | 'alphaTabVersion' | 'instruments'>, versionComment: string = '新規登録', version?: string) {
    const db = await getDb();
    const now = new Date();
    const finalVersion = version || await getNextVersion();

    const tabData = {
        ...tab,
        instruments: getCoarseInstruments(tab.tracks.map(t => t.instrument)),
        alphaTabVersion: ALPHA_TAB_VERSION,
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

    await createTabSummary(tabId);

    return result;
}

export async function getTabsByUserId(userId: ObjectId, query: { name?: string, visibility?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', limit?: number } = {}) {
    const db = await getDb();
    const filter: any = { userId };

    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.visibility) {
        filter.visibility = query.visibility;
    }

    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
    const pipeline: any[] = [
        { $match: filter },
        {
            $lookup: {
                from: 'tab_summaries',
                localField: '_id',
                foreignField: 'tabId',
                as: 'summary'
            }
        },
        {
            $addFields: {
                viewCount: { $ifNull: [{ $arrayElemAt: ['$summary.viewCount', 0] }, 0] },
                favoriteCount: { $ifNull: [{ $arrayElemAt: ['$summary.favoriteCount', 0] }, 0] }
            }
        }
    ];

    if (query.sortBy === 'visibility') {
        pipeline.push({
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
        });
        pipeline.push({ $sort: { visibilityOrder: sortOrder, _id: 1 } });
    } else if (query.sortBy) {
        pipeline.push({ $sort: { [query.sortBy]: sortOrder, _id: 1 } });
    } else {
        pipeline.push({ $sort: { _id: 1 } });
    }

    if (query.limit) {
        pipeline.push({ $limit: query.limit });
    }

    return await db.collection('tabs').aggregate(pipeline).toArray();
}

export async function getTabById(id: ObjectId) {
    const db = await getDb();
    const tab = await db.collection('tabs').findOne({ _id: id });
    if (!tab) return null;

    const user = await db.collection('users').findOne({ _id: tab.userId });
    return {
        texPublicSetting: 'private',
        historyPublicSetting: 'private',
        ...tab,
        user: user ? {
            _id: user._id,
            username: user.username
        } : null
    } as any;
}

export async function updateTab(id: ObjectId, userId: ObjectId, tab: Omit<Tab, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'version' | 'alphaTabVersion' | 'instruments'>, versionComment: string, version?: string) {
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
                instruments: getCoarseInstruments(tab.tracks.map(t => t.instrument)),
                alphaTabVersion: ALPHA_TAB_VERSION,
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

    return (await db.collection('tab_histories')
        .find({ tabId })
        .sort(sort)
        .toArray()).map(history => ({
            texPublicSetting: 'private',
            historyPublicSetting: 'private',
            ...history
        })) as unknown as TabHistory[];
}

export async function getTabHistoryByVersion(tabId: ObjectId, version: string) {
    const db = await getDb();
    const history = await db.collection('tab_histories')
        .findOne({ tabId, version });
    
    if (!history) return null;

    return {
        texPublicSetting: 'private',
        historyPublicSetting: 'private',
        ...history
    } as unknown as TabHistory;
}

export async function countPublicTabsByUserId(userId: ObjectId) {
    const db = await getDb();
    return await db.collection('tabs').countDocuments({ userId, visibility: 'public' });
}

export async function searchPublicTabs(query: { name?: string, instruments?: string[], sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}) {
    const db = await getDb();
    const filter: any = { visibility: 'public' };

    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.instruments && query.instruments.length > 0) {
        filter.instruments = { $in: query.instruments };
    }

    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
    const sortBy = query.sortBy || 'updatedAt';
    const sort: any = { [sortBy]: sortOrder, _id: 1 };

    const pipeline: any[] = [
        { $match: filter },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 1,
                name: 1,
                instruments: 1,
                updatedAt: 1,
                'user._id': 1,
                'user.username': 1
            }
        },
        { $sort: sort }
    ];

    return await db.collection('tabs').aggregate(pipeline).toArray();
}

export async function getRecentPublicTabs(limit: number = 5) {
    const db = await getDb();
    const pipeline: any[] = [
        { $match: { visibility: 'public' } },
        { $sort: { updatedAt: -1, _id: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 1,
                name: 1,
                instruments: 1,
                updatedAt: 1,
                createdAt: 1,
                'user._id': 1,
                'user.username': 1
            }
        }
    ];
    return await db.collection('tabs').aggregate(pipeline).toArray();
}

export async function searchTabsAsAdmin(query: { name?: string; username?: string }) {
    const db = await getDb();
    const filter: any = {};
    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }
    
    if (query.username) {
        const users = await db.collection('users').find({
            username: { $regex: query.username, $options: 'i' }
        }).toArray();
        const userIds = users.map(u => u._id);
        filter.userId = { $in: userIds };
    }

    const tabs = await db.collection<Tab>('tabs').aggregate([
        { $match: filter },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $lookup: {
                from: 'tab_summaries',
                localField: '_id',
                foreignField: 'tabId',
                as: 'summary'
            }
        },
        { $unwind: { path: '$summary', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                viewCount: { $ifNull: ['$summary.viewCount', 0] },
                favoriteCount: { $ifNull: ['$summary.favoriteCount', 0] }
            }
        },
        { $sort: { updatedAt: -1 } }
    ]).toArray();

    return tabs;
}

export async function getTopFavoritedPublicTabs(limit: number = 5) {
    const db = await getDb();
    const pipeline: any[] = [
        { $match: { visibility: 'public' } },
        {
            $lookup: {
                from: 'tab_summaries',
                localField: '_id',
                foreignField: 'tabId',
                as: 'summary'
            }
        },
        { $unwind: { path: '$summary', preserveNullAndEmptyArrays: true } },
        { $addFields: { favoriteCount: { $ifNull: ['$summary.favoriteCount', 0] } } },
        { $sort: { favoriteCount: -1, createdAt: -1, _id: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 1,
                name: 1,
                instruments: 1,
                updatedAt: 1,
                favoriteCount: 1,
                'user._id': 1,
                'user.username': 1
            }
        }
    ];
    return await db.collection('tabs').aggregate(pipeline).toArray();
}
