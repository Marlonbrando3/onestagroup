import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CiPhone } from "react-icons/ci";
import { MontserratSans } from "@/fonts/fonts";

export default function AboutUsInspired() {
  const router = useRouter();
  const submitButton = useRef<HTMLButtonElement | null>(null);

  const [dataForm, setDataForm] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Message: "",
  });
  const [contactTime, setContactTime] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState(false);

  const toggleTime = (slot: string) => {
    setContactTime((prev) =>
      prev.includes(slot) ? prev.filter((v) => v !== slot) : [...prev, slot],
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!privacy) {
      alert("Zaakceptuj politykę prywatności.");
      return;
    }

    if (submitButton.current) {
      submitButton.current.innerText = "Wysyłam...";
      submitButton.current.disabled = true;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Ref: "About Us",
          dataForm: {
            ...dataForm,
            Message: `${dataForm.Message}\n\nPreferowana pora kontaktu: ${contactTime.join(", ") || "brak"}`,
          },
          consents: { privacy, marketing: false },
          source: router.asPath,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Send failed");

      if (submitButton.current) {
        submitButton.current.innerText = "Wysłano";
      }
    } catch {
      if (submitButton.current) {
        submitButton.current.innerText = "Błąd, spróbuj ponownie";
        submitButton.current.disabled = false;
      }
    }
  };

  return (
    <section
      className={`${MontserratSans.className} w-[95vw] max-w-[1400px] mx-auto py-10 lg:py-16`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-8 lg:gap-12 items-start">
        <div className="text-slate-700 leading-[1.7] text-[18px]">
          <h2 className="text-[40px] leading-[1.1] font-[700] text-slate-800 mb-6">
            Nasza misja
          </h2>
          <p>
            Onesta to uczciwość i transparentność. Nad wyraz cenimy sobie
            możliwość spełniania marzeń naszych klientów i łączenia ich
            realizacji ze stylem życia w ciepłych krajach. <br></br>Jesteśmy tu
            po to, aby od pierwszej wizyty na naszej stronie do chwili odbioru
            kluczy cały proces zakupu nieruchomości w Hiszpanii był spokojny,
            bezpieczny i uporządkowany. Pracujemy transparentnie, krok po kroku,
            z pełnym wsparciem językowym oraz formalnym.
          </p>

          <h2 className="text-[40px] leading-[1.1] font-[700] text-slate-800 mt-10 mb-6">
            Dlaczego my?
          </h2>
          <p>
            Od 8 lat współpracujemy z zaufanymi doradcami, prawnikami i
            deweloperami or innymi biurami nieruchomości, dlatego nasi klienci
            dostają zweryfikowane oferty i realne porównanie rynku. Znamy
            lokalne procedury, koszty i ryzyka, dzięki czemu decyzje podejmujesz
            na podstawie konkretnych danych, a nie obietnic. Naszą współpracę
            opieramy na znajomości rynku oraz dostępie do szerokiego spectrum
            dobrych ofer. Poprzez wyraźne zrozumienie Twoich potrzeb dostarczamy
            rozwiązania w postaci ofert i usług mając na celu budowanie całego
            procesu na zaufaniu, otwartości, wiedzy.
          </p>

          <h2 className="text-[40px] leading-[1.1] font-[700] text-slate-800 mt-10 mb-6">
            Przekonaj się czy możemy Ci pomóc
          </h2>
          <p>
            Napisz do nas czego szukasz: lokalizacja, budżet, cel zakupu. Na tej
            podstawie przygotujemy shortlistę ofert i plan działania. Zapraszamy
            również do rozmowy telefonicznej w której zadamy pytania pozwalające
            nam zrozumieć dokłądnie charakter tego czego szukasz.
          </p>
        </div>

        <aside className="max-w-[520px] w-full lg:self-start fixex">
          <div className="bg-[#f2f2f2] rounded-[18px] p-4 lg:p-5 lg:sticky lg:top-[110px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[24px] leading-[0.95] font-[700] text-slate-800">
                  Napisz do Nas
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center text-orange-500 font-[700] text-[12px]">
                  <CiPhone className="w-4 h-4 mr-1" />
                  lub zadzwoń
                </div>
                <p className="text-[24px] leading-[1] font-[800] text-orange-500 mt-1 whitespace-nowrap">
                  +48 576 65 25 25
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-[13px] mt-3 mb-4">
              Wypełnij formularz, a oddzwonimy do Ciebie.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                type="text"
                placeholder="Imię i Nazwisko *"
                className="w-full bg-white rounded-[8px] h-10 px-3 text-[13px] outline-none border border-gray-200"
                onChange={(e) =>
                  setDataForm((p) => ({ ...p, Name: e.target.value }))
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  required
                  type="email"
                  placeholder="Adres e-mail *"
                  className="w-full bg-white rounded-[8px] h-10 px-3 text-[13px] outline-none border border-gray-200"
                  onChange={(e) =>
                    setDataForm((p) => ({ ...p, Email: e.target.value }))
                  }
                />
                <input
                  required
                  type="tel"
                  placeholder="Numer telefonu *"
                  className="w-full bg-white rounded-[8px] h-10 px-3 text-[13px] outline-none border border-gray-200"
                  onChange={(e) =>
                    setDataForm((p) => ({ ...p, Phone: e.target.value }))
                  }
                />
              </div>
              <textarea
                placeholder="Wiadomość"
                className="w-full bg-white rounded-[8px] h-28 px-3 py-2 text-[13px] outline-none border border-gray-200 resize-none"
                onChange={(e) =>
                  setDataForm((p) => ({ ...p, Message: e.target.value }))
                }
              />

              <div>
                <p className="text-slate-700 text-[13px] mb-2">
                  Dogodna pora kontaktu:
                </p>
                <div className="flex flex-wrap gap-4">
                  {["9-13", "13-17", "17-21"].map((slot) => (
                    <label
                      key={slot}
                      className="inline-flex items-center gap-2 text-[13px]"
                    >
                      <input
                        type="checkbox"
                        checked={contactTime.includes(slot)}
                        onChange={() => toggleTime(slot)}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="inline-flex items-start gap-2 text-[13px]">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1"
                  checked={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  required
                />
                <span className="text-slate-700">
                  Oświadczam, że zapoznałem/am się z{" "}
                  <Link href="/polityka-prywatnosci" className="underline">
                    Polityką Prywatności
                  </Link>
                  .
                </span>
              </label>

              <button
                ref={submitButton}
                type="submit"
                className="w-full h-10 rounded-full bg-[#0f8ff1] text-white text-[18px] font-[700] leading-none"
              >
                Wyślij
              </button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}
