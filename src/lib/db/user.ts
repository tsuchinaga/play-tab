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
}

export async function findUserByLoginId(loginId: string) {
    const db = await getDb();
    return await db.collection<User>('users').findOne({ loginId, isDeleted: false });
}

export async function findUserById(id: ObjectId) {
    const db = await getDb();
    return await db.collection<User>('users').findOne({ _id: id, isDeleted: false });
}

export async function createUser(user: { loginId: string; username: string; hashedPassword: string }) {
    const db = await getDb();
    const result = await db.collection<User>('users').insertOne({
        ...user,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result;
}

export async function updateUser(id: ObjectId, user: Partial<Pick<User, 'username' | 'hashedPassword'>>) {
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
