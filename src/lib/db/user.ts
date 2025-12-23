import { getDb } from './client';

export async function findUserByLoginId(loginId: string) {
    const db = await getDb();
    return await db.collection('users').findOne({ loginId, isDeleted: false });
}

export async function createUser(user: { loginId: string; username: string; hashedPassword: string }) {
    const db = await getDb();
    const result = await db.collection('users').insertOne({
        ...user,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result;
}
