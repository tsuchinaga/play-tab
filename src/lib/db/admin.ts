import { getDb } from './client';

export async function findAdministratorByLoginId(loginId: string) {
    const db = await getDb();
    return await db.collection('administrators').findOne({ loginId, isDeleted: false });
}
