import { getDb } from './client';
export async function createSession(data: any) {
    const db = await getDb();
    const sessionId = crypto.randomUUID();
    const session = {
        sessionId,
        data,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    };
    await db.collection('sessions').insertOne(session);
    return sessionId;
}

export async function getSession(sessionId: string) {
    const db = await getDb();
    const session = await db.collection('sessions').findOne({ sessionId, expiresAt: { $gt: new Date() } });
    return session ? session.data : null;
}

export async function getFullSession(sessionId: string) {
    const db = await getDb();
    const session = await db.collection('sessions').findOne({ sessionId, expiresAt: { $gt: new Date() } });
    return session;
}

export async function deleteSession(sessionId: string) {
    const db = await getDb();
    await db.collection('sessions').deleteOne({ sessionId });
}

export async function updateSession(sessionId: string, data: any) {
    const db = await getDb();
    await db.collection('sessions').updateOne({ sessionId }, { $set: { data } });
}
