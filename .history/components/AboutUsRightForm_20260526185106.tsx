import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CiPhone } from "react-icons/ci";
import { MontserratSans } from "@/fonts/fonts";

export default function AboutUsRightForm() {
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
      if (submitButton.current) submitButton.current.innerText = "Wysłano";
    } catch {
      if (submitButton.current) {
        submitButton.current.innerText = "Błąd, spróbuj ponownie";
        submitButton.current.disabled = false;
      }
    }
  };

  return (
    <div>
      <aside
        className={`${MontserratSans.className} w-full lg:sticky lg:top-[100px] lg:self-start`}
      >
        <div className="bg-[#f2f2f2] rounded-[18px] p-4 lg:p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[24px] leading-[0.95] font-[700] text-slate-800">
              Napisz do Nas
            </p>
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
  );
}
