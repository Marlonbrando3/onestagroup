import { verify } from "jsonwebtoken";
import { getCookie } from "cookies-next";

export default function admin(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.PANEL_JWT_SECRET;
  if (!secret) {
    return res.status(503).json({ error: "Panel JWT nie jest skonfigurowany" });
  }

  const cookie = getCookie("auth", { req, res });
  if (typeof cookie !== "string" || !cookie) {
    return res.status(401).json({ error: "Brak sesji" });
  }

  try {
    const decoded = verify(cookie, secret);
    return res.status(200).json({ msg: "uprawnienia przyznane", user: decoded });
  } catch {
    return res.status(401).json({ error: "Nieprawidłowa sesja" });
  }
}
