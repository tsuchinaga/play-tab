import type { ObjectId } from 'mongodb';
import { getDb } from './client';

export interface User {
    _id?: ObjectId;
    loginId: string;
    username: string;
    email: string;
    hashedPassword: string;
    isDeleted: boolean;
    isActive: boolean;
    isEmailVerified: boolean;
    expiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    registeredTabsVisibility: 'private' | 'logged_in' | 'public';
    favoritedTabsVisibility: 'private' | 'logged_in' | 'public';
}

export async function findUserByLoginId(loginId: string) {
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({
        loginId,
        isDeleted: false,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    });
    if (user) {
        user.registeredTabsVisibility = user.registeredTabsVisibility ?? 'public';
        user.favoritedTabsVisibility = user.favoritedTabsVisibility ?? 'public';
        user.isActive = user.isActive ?? true;
        user.isEmailVerified = user.isEmailVerified ?? false;
        user.expiresAt = user.expiresAt ?? null;
    }
    return user;
}

export async function findUserById(id: ObjectId, includeDeleted = false) {
    const db = await getDb();
    const filter: any = {
        _id: id,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    };
    if (!includeDeleted) {
        filter.isDeleted = false;
    }
    const user = await db.collection<User>('users').findOne(filter);
    if (user) {
        user.registeredTabsVisibility = user.registeredTabsVisibility ?? 'public';
        user.favoritedTabsVisibility = user.favoritedTabsVisibility ?? 'public';
        user.isActive = user.isActive ?? true;
        user.isEmailVerified = user.isEmailVerified ?? false;
        user.expiresAt = user.expiresAt ?? null;
    }
    return user;
}

export async function createUser(user: { loginId: string; username: string; email: string; hashedPassword: string }) {
    const db = await getDb();
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24時間有効
    const result = await db.collection<User>('users').insertOne({
        ...user,
        isDeleted: false,
        isActive: true,
        isEmailVerified: false,
        expiresAt: expiration,
        registeredTabsVisibility: 'public',
        favoritedTabsVisibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result;
}

export async function searchUsers(query: { loginId?: string; username?: string; email?: string; includeDeleted?: boolean }) {
    const db = await getDb();
    const filter: any = {};
    if (!query.includeDeleted) {
        filter.isDeleted = false;
    }
    if (query.loginId) {
        filter.loginId = { $regex: query.loginId, $options: 'i' };
    }
    if (query.username) {
        filter.username = { $regex: query.username, $options: 'i' };
    }
    if (query.email) {
        filter.email = { $regex: query.email, $options: 'i' };
    }
    return (await db.collection<User>('users').find(filter).sort({ createdAt: -1 }).toArray()).map(user => {
        user.isActive = user.isActive ?? true;
        user.isEmailVerified = user.isEmailVerified ?? false;
        user.expiresAt = user.expiresAt ?? null;
        return user;
    });
}

export async function deleteUser(id: ObjectId) {
    const db = await getDb();
    const result = await db.collection<User>('users').updateOne(
        { _id: id },
        {
            $set: {
                isDeleted: true,
                updatedAt: new Date()
            }
        }
    );
    return result;
}

export async function hardDeleteUser(id: ObjectId) {
    const db = await getDb();

    // ユーザーに紐付くTAB譜を取得
    const tabs = await db.collection('tabs').find({ userId: id }).toArray();
    const tabIds = tabs.map(tab => tab._id);

    // TAB譜に紐付くデータの削除
    if (tabIds.length > 0) {
        await db.collection('favorite_tabs').deleteMany({ tabId: { $in: tabIds } });
        await db.collection('tab_histories').deleteMany({ tabId: { $in: tabIds } });
        await db.collection('tab_summaries').deleteMany({ tabId: { $in: tabIds } });
    }

    // ユーザーに直接紐付くデータの削除
    await db.collection('tabs').deleteMany({ userId: id });
    await db.collection('favorite_tabs').deleteMany({ userId: id });
    await db.collection('sessions').deleteMany({ 'data.user.id': id.toString() });

    // ユーザー自身の削除
    const result = await db.collection<User>('users').deleteOne({ _id: id });
    return result;
}

export async function updateUser(id: ObjectId, user: Partial<Pick<User, 'username' | 'email' | 'hashedPassword' | 'registeredTabsVisibility' | 'favoritedTabsVisibility' | 'isActive' | 'isEmailVerified' | 'expiresAt'>>) {
    const db = await getDb();
    const result = await db.collection<User>('users').updateOne(
        { _id: id },
        {
            $set: {
                ...user,
                updatedAt: new Date()
            }
        }
    );
    return result;
}
