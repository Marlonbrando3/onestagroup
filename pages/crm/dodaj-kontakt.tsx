// Dodawanie szans sprzedaży odbywa się wyłącznie z lejka (przycisk „Szansa sprzedaży”).
// Stary adres /crm/dodaj-kontakt przekierowuje na lejek, żeby zapisane zakładki nie dawały błędu 404.
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CRMAddContactRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm");
  }, [router]);
  return null;
}
