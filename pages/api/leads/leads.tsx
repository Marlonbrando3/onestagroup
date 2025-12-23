import axios from "axios";

const PAGE_ACCESS_TOKEN = process.env.sandbox_token; // Wstaw swój token dostępu do strony
const ACCESS_TOKEN = process.env.access_token;
const LEADS_FORM_ID = 955308019838546; // Wstaw ID formularza
const PAGE_ID = process.env.PAGE_ID;

export default async function GET(req: any, res: any) {
  try {
    // Wysłanie żądania do Graph API
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${LEADS_FORM_ID}/leads?access_token`,
      {
        params: {
          access_token: ACCESS_TOKEN, // Przekazanie tokena dostępu
        },
      },
    );

    // Zwracamy dane leadów
    // const leads = response.data.data; // Typowane automatycznie jako `any` przez Axios
    const leads = await response.data.data; // Typowane automatycznie jako `any` przez Axios
    console.log("powrót" + response.data.data);
    return res.status(200).json({
      data: leads,
    });
  } catch (error: unknown) {
    // Obsługa błędów: bezpieczne rzutowanie `unknown`
    if (axios.isAxiosError(error)) {
      console.error("Błąd Axios:", error.response?.data || error.message);
      return res.status(error.response?.status || 500).json({
        error: error.response?.data || "Nie udało się pobrać danych leadów.",
      });
    } else {
      console.error("Nieznany błąd:", error);
      return res.status(500).json({ error: "Nieoczekiwany błąd serwera." });
    }
  }
}
