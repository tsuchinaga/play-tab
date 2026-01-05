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
    createdAt: Date;
    updatedAt: Date;
    registeredTabsVisibility: 'private' | 'logged_in' | 'public';
    favoritedTabsVisibility: 'private' | 'logged_in' | 'public';
}

export async function findUserByLoginId(loginId: string) {
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({ loginId, isDeleted: false });
    if (user) {
        user.registeredTabsVisibility = user.registeredTabsVisibility ?? 'public';
        user.favoritedTabsVisibility = user.favoritedTabsVisibility ?? 'public';
        user.isActive = user.isActive ?? true;
    }
    return user;
}

export async function findUserById(id: ObjectId) {
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({ _id: id, isDeleted: false });
    if (user) {
        user.registeredTabsVisibility = user.registeredTabsVisibility ?? 'public';
        user.favoritedTabsVisibility = user.favoritedTabsVisibility ?? 'public';
        user.isActive = user.isActive ?? true;
    }
    return user;
}

export async function createUser(user: { loginId: string; username: string; email: string; hashedPassword: string }) {
    const db = await getDb();
    const result = await db.collection<User>('users').insertOne({
        ...user,
        isDeleted: false,
        isActive: true,
        registeredTabsVisibility: 'public',
        favoritedTabsVisibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result;
}

export async function searchUsers(query: { loginId?: string; username?: string; email?: string }) {
    const db = await getDb();
    const filter: any = { isDeleted: false };
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
        return user;
    });
}

export async function updateUser(id: ObjectId, user: Partial<Pick<User, 'username' | 'email' | 'hashedPassword' | 'registeredTabsVisibility' | 'favoritedTabsVisibility' | 'isActive'>>) {
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
