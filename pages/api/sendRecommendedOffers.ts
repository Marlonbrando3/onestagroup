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

  const { budgetMax, email } = req.body;

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

  try {
    if (!process.env.FROM_EMAIL || !process.env.EMAIL_PASS) {
      console.error("Missing email configuration");
      return res.status(500).json({
        error: "Email configuration is missing",
      });
    }

    console.log("Configuring email transporter...");
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "mail-serwer141299.lh.pl",
      secure: true,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Verifying transporter connection...");
    await transporter.verify();
    console.log("Transporter verified successfully");

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.END_EMAIL,
      subject: "Nowa prośba o rekomendowane oferty",
      html: `
        <h2>Nowa prośba o rekomendowane oferty</h2>
        <p><strong>Email klienta:</strong> ${email}</p>
        <p><strong>Maksymalny budżet:</strong> €${Number(budgetMax).toLocaleString()}</p>
        <p><strong>Data/Czas:</strong> ${new Date().toLocaleString("pl-PL")}</p>
      `,
    };

    console.log("Sending email...");
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result);

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
