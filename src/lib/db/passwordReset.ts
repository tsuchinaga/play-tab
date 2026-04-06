import type { ObjectId } from 'mongodb';
import { getDb } from './client';

export interface PasswordResetToken {
    _id?: ObjectId;
    userId: ObjectId;
    token: string;
    createdAt: Date;
    expiresAt: Date;
}

/**
 * パスワード再設定用トークンを作成する
 * @param userId ユーザーID
 * @returns 生成されたトークン
 */
export async function createPasswordResetToken(userId: ObjectId) {
    const db = await getDb();
    const token = crypto.randomUUID();
    const expiration = new Date(Date.now() + 1000 * 60 * 30); // 30分有効
    
    await db.collection<PasswordResetToken>('password_reset_tokens').insertOne({
        userId,
        token,
        createdAt: new Date(),
        expiresAt: expiration
    });
    
    return token;
}

/**
 * トークンからパスワード再設定用データを取得する
 * @param token トークン
 * @returns パスワード再設定用データまたはnull
 */
export async function findPasswordResetToken(token: string) {
    const db = await getDb();
    return await db.collection<PasswordResetToken>('password_reset_tokens').findOne({
        token,
        expiresAt: { $gt: new Date() }
    });
}

/**
 * ユーザーIDに紐付くトークンを削除する（古いトークンの掃除用）
 * @param userId ユーザーID
 */
export async function deletePasswordResetTokensByUserId(userId: ObjectId) {
    const db = await getDb();
    await db.collection<PasswordResetToken>('password_reset_tokens').deleteMany({ userId });
}

/**
 * トークンを削除する（使用後の削除用）
 * @param token トークン
 */
export async function deletePasswordResetToken(token: string) {
    const db = await getDb();
    await db.collection<PasswordResetToken>('password_reset_tokens').deleteOne({ token });
}
