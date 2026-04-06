import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: Number(env.SMTP_PORT),
	auth: env.SMTP_USER ? {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS
	} : undefined,
	secure: env.SMTP_SECURE === 'true',
	requireTLS: env.SMTP_REQUIRE_TLS === 'true',
	tls: {
		rejectUnauthorized: env.SMTP_TLS_REJECT_UNAUTHORIZED === 'true'
	}
});

/**
 * メールを送信する
 * @param to 送信先
 * @param subject 件名
 * @param text 本文(テキスト)
 * @param html 本文(HTML)
 */
export async function sendMail(to: string, subject: string, text: string, html?: string) {
	const fromEmail = env.SMTP_FROM || 'noreply@example.com';
	const fromName = 'Play Tab';
	const from = `"${fromName}" <${fromEmail}>`;
	
	await transporter.sendMail({
		from,
		to,
		subject,
		text,
		html
	});
}
