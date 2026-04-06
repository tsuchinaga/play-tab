import type { ObjectId } from 'mongodb';
import { getDb } from './client';

export interface EmailVerificationToken {
    _id?: ObjectId;
    userId: ObjectId;
    token: string;
    code: string;
    createdAt: Date;
    expiresAt: Date;
}

/**
 * メール確認用トークンと認証コードを作成する
 * @param userId ユーザーID
 * @returns 生成されたトークンと認証コード
 */
export async function createEmailVerificationToken(userId: ObjectId) {
    const db = await getDb();
    const token = crypto.randomUUID();
    // 6桁の数字を生成
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24時間有効
    
    await db.collection<EmailVerificationToken>('email_verification_tokens').insertOne({
        userId,
        token,
        code,
        createdAt: new Date(),
        expiresAt: expiration
    });
    
    return { token, code };
}

/**
 * トークンからメール確認用データを取得する
 * @param token トークン
 * @returns メール確認用データまたはnull
 */
export async function findEmailVerificationToken(token: string) {
    const db = await getDb();
    return await db.collection<EmailVerificationToken>('email_verification_tokens').findOne({
        token,
        expiresAt: { $gt: new Date() }
    });
}

/**
 * ユーザーIDに紐付くトークンを削除する（古いトークンの掃除用）
 * @param userId ユーザーID
 */
export async function deleteEmailVerificationTokensByUserId(userId: ObjectId) {
    const db = await getDb();
    await db.collection<EmailVerificationToken>('email_verification_tokens').deleteMany({ userId });
}

/**
 * トークンを削除する（使用後の削除用）
 * @param token トークン
 */
export async function deleteEmailVerificationToken(token: string) {
    const db = await getDb();
    await db.collection<EmailVerificationToken>('email_verification_tokens').deleteOne({ token });
}
