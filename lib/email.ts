import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";

const transporter = nodemailer.createTransport({
  port: 465,
  host: process.env.EMAIL_HOST,
  secure: true,
  tls: { ciphers: "SSLv3" },
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const RECIPIENT = process.env.RECIPIENT_EMAIL ?? "marek.marszalek@onesta.com.pl";
export const LEADS_RECIPIENT = process.env.LEADS_EMAIL ?? "leady@onesta.com.pl";
export const FROM = `Onesta Group <${process.env.FROM_EMAIL}>`;

export async function sendMail(options: SendMailOptions): Promise<void> {
  await transporter.sendMail({ from: FROM, ...options });
}
