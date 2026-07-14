# Mailing w CRM Onesta

Moduł jest widoczny wyłącznie dla administratora CRM i dodatkowo chroniony na poziomie każdego endpointu API.

## Konfiguracja Resend

Dodaj do środowiska produkcyjnego:

```env
RESEND_API_KEY=re_...
MAILING_FROM_EMAIL=kontakt@mail.onesta.com.pl
MAILING_FROM_NAME=Marek z Onesta
MAILING_REPLY_TO=marek.marszalek@onesta.com.pl
RESEND_WEBHOOK_SECRET=whsec_...
```

W Resend trzeba zweryfikować domenę wysyłkową, najlepiej osobną subdomenę, np. `mail.onesta.com.pl`, oraz ustawić wskazane przez Resend rekordy SPF i DKIM. Domena główna powinna mieć również DMARC.

Webhook Resend ustaw na:

```text
https://onesta.com.pl/api/crm/mailing/webhook
```

Włącz zdarzenia: `contact.updated`, `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained`, `email.failed` i `email.suppressed`.

## Zasady wysyłki

- Kampania uwzględnia wyłącznie kontakty ze statusem `Zgoda zapisana` i poprawnym adresem e-mail.
- Kontakty wypisane, zablokowane, odbite lub zgłaszające spam są pomijane.
- Każda wiadomość marketingowa zawiera obsługiwany przez Resend link wypisania.
- Import kontaktów nie ustawia ponownie statusu subskrypcji, więc nie nadpisuje wypisania zapisanego w Resend.
- Wysyłka jest planowana co najmniej 10 minut naprzód, aby Resend zdążył przetworzyć import odbiorców.

## Baza danych

Schemat znajduje się w `scripts/crm_mailing_schema.sql`. Jest idempotentny i może być uruchomiony ponownie.

Dokumentacja techniczna:

- https://resend.com/docs/api-reference/broadcasts/create-broadcast
- https://resend.com/docs/api-reference/contacts/create-contact-import
- https://resend.com/docs/webhooks/verify-webhooks-requests
- https://support.google.com/mail/answer/81126

