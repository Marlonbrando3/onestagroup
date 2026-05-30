import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type ResponseData = {
  success?: boolean;
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { budgetMax, email, rodoConsent, marketingConsent } = req.body;

  // Validation
  if (!email || !budgetMax) {
    return res.status(400).json({ error: "Email and budget are required" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (isNaN(Number(budgetMax)) || Number(budgetMax) <= 0) {
    return res.status(400).json({ error: "Invalid budget amount" });
  }

  if (!rodoConsent) {
    return res.status(400).json({ error: "Privacy policy consent is required" });
  }

  const endEmail = "marek.marszalek@onesta.com.pl";
  const fromEmail = process.env.FROM_EMAIL;
  const pass = process.env.EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "mail-serwer141299.lh.pl",
    secure: true,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: fromEmail,
      pass,
    },
  });

  const mailData = {
    from: fromEmail,
    to: endEmail,
    subject: "Nowa prośba o rekomendowane oferty",
    html: `
      <h2>Nowa prośba o rekomendowane oferty</h2>
      <p><strong>Email klienta:</strong> ${email}</p>
      <p><strong>Maksymalny budżet:</strong> €${Number(budgetMax).toLocaleString()}</p>
      <p><strong>Zaakceptowano politykę prywatności:</strong> tak</p>
      <p><strong>Zgoda marketingowa:</strong> ${marketingConsent ? "tak" : "nie"}</p>
      <p><strong>Data/Czas:</strong> ${new Date().toLocaleString("pl-PL")}</p>
    `,
  };

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      error: "Failed to send email. Please try again later.",
    });
  }
}
