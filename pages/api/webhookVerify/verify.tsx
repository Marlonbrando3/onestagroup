export default async function GET(req: any, res: any) {
  //100071864003899

  // 955308019838546
  // Pobranie parametrów zapytania
  const url = new URL(req.url, `http://${req.headers.host}`);
  const verifyToken = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const token = process.env.token;

  // Sprawdzenie, czy token weryfikacyjny jest poprawny
  const FACEBOOK_VERIFY_TOKEN = token; // Zamień na swój token
  if (verifyToken === FACEBOOK_VERIFY_TOKEN && challenge) {
    // Weryfikacja zakończona sukcesem, zwróć challenge
    return res.status(200).send(challenge);
  } else {
    // Błąd weryfikacji
    return res.status(403).json({ error: "Invalid token" });
  }
}
