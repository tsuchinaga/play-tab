import type { ObjectId } from 'mongodb';
import { getDb } from './client';

export interface Administrator {
    _id?: ObjectId;
    loginId: string;
    email: string;
    hashedPassword: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export async function findAdministratorByLoginId(loginId: string) {
    const db = await getDb();
    return await db.collection<Administrator>('administrators').findOne({ loginId, isDeleted: false });
}

export async function findAdministratorById(id: ObjectId) {
    const db = await getDb();
    return await db.collection<Administrator>('administrators').findOne({ _id: id, isDeleted: false });
}

export async function getAllAdministrators() {
    const db = await getDb();
    return await db.collection<Administrator>('administrators').find({ isDeleted: false }).sort({ createdAt: 1 }).toArray();
}

export async function createAdministrator(admin: { loginId: string; email: string; hashedPassword: string }) {
    const db = await getDb();
    return await db.collection<Administrator>('administrators').insertOne({
        ...admin,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });
}

export async function updateAdministrator(id: ObjectId, admin: Partial<Pick<Administrator, 'hashedPassword' | 'email'>>) {
    const db = await getDb();
    return await db.collection<Administrator>('administrators').updateOne(
        { _id: id },
        {
            $set: {
                ...admin,
                updatedAt: new Date()
            }
        }
    );
}

export async function deleteAdministrator(id: ObjectId) {
    const db = await getDb();
    return await db.collection<Administrator>('administrators').updateOne(
        { _id: id },
        {
            $set: {
                isDeleted: true,
                updatedAt: new Date()
            }
        }
    );
}
