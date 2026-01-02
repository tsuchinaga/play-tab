import type { ObjectId } from 'mongodb';
import { getDb } from './client';

export interface User {
    _id?: ObjectId;
    loginId: string;
    username: string;
    hashedPassword: string;
    isDeleted: boolean;
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
    }
    return user;
}

export async function findUserById(id: ObjectId) {
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({ _id: id, isDeleted: false });
    if (user) {
        user.registeredTabsVisibility = user.registeredTabsVisibility ?? 'public';
        user.favoritedTabsVisibility = user.favoritedTabsVisibility ?? 'public';
    }
    return user;
}

export async function createUser(user: { loginId: string; username: string; hashedPassword: string }) {
    const db = await getDb();
    const result = await db.collection<User>('users').insertOne({
        ...user,
        isDeleted: false,
        registeredTabsVisibility: 'public',
        favoritedTabsVisibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result;
}

export async function updateUser(id: ObjectId, user: Partial<Pick<User, 'username' | 'hashedPassword' | 'registeredTabsVisibility' | 'favoritedTabsVisibility'>>) {
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
