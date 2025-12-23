import { getDb } from './client';

export async function findUserByLoginId(loginId: string) {
    const db = await getDb();
    return await db.collection('users').findOne({ loginId, isDeleted: false });
}
