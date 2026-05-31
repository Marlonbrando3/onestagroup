import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";

type PopupStep = "initial" | "form";

interface FormData {
  budgetMax: string;
  email: string;
  rodoConsent: boolean;
  marketingConsent: boolean; // ⬅️ DODANE
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecommendedOffersPopup({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<PopupStep>("initial");
  const [formData, setFormData] = useState<FormData>({
    budgetMax: "",
    email: "",
    rodoConsent: false,
    marketingConsent: false, // ⬅️ DODANE
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleBrowsingOnly = () => {
    onClose();
    setStep("initial");
  };

  const handleRequestOffers = () => {
    setStep("form");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) return "Email jest wymagany";
    if (!formData.email.includes("@")) return "Podaj prawidłowy adres email";
    if (!formData.budgetMax.trim()) return "Budżet jest wymagany";
    if (isNaN(Number(formData.budgetMax)) || Number(formData.budgetMax) <= 0)
      return "Podaj prawidłową kwotę";
    if (!formData.rodoConsent)
      return "Musisz zaakceptować politykę prywatności";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/sendRecommendedOffers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Błąd wysyłania");
        return;
      }

      trackGoogleAdsContactConversion();
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setStep("initial");
        setFormData({
          budgetMax: "",
          email: "",
          rodoConsent: false,
          marketingConsent: false, // ⬅️ RESET
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Błąd połączenia. Spróbuj ponownie.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose className="w-6 h-6" />
        </button>

        {step === "initial" && (
          <div className="p-8 text-center">
            <h2 className="text-[30px] font-semibold mb-8 text-gray-800">
              Nie wiesz co wybrać?
              <p className="text-[16px]">
                Zamów zestaw TOP 10 ofert w Twoim bużecie.
              </p>
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleRequestOffers}
                className="w-full px-4 py-3 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors"
              >
                Prześlij mi rekomendowane oferty
              </button>
              <button
                onClick={handleBrowsingOnly}
                className="w-full px-4 py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-md hover:bg-yellow-50 transition-colors"
              >
                Tylko przeglądam
              </button>
            </div>
          </div>
        )}

        {step === "form" && (
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Podaj swój budżet
            </h2>

            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
                Dziękujemy! Wkrótce otrzymasz rekomendacje.
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksymalny budżet (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="budgetMax"
                  value={formData.budgetMax}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* ✔ POPRAWIONE CHECKBOXY */}
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="rodoConsent"
                    id="rodoConsent"
                    checked={formData.rodoConsent}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 accent-yellow-500 min-w-[20px] min-h-[20px]"
                  />
                  <label
                    htmlFor="rodoConsent"
                    className="text-sm text-gray-700 mt-[5px]"
                  >
                    Akceptuję{" "}
                    <a
                      href="https://onesta.com.pl/polityka-prywatnosci"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-500 underline"
                    >
                      politykę prywatności
                    </a>
                    <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    id="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 accent-yellow-500 min-w-[20px] min-h-[20px]"
                  />
                  <label
                    htmlFor="marketingConsent"
                    className="text-sm text-gray-700 mt-[5px]"
                  >
                    Wyrażam zgodę na przetwarzanie moich danych osobowych przez
                    Onesta Group Sp. z o.o. w celach marketingowych, w tym na
                    kontakt mailowy w celu przedstawienia ofert nieruchomości.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-yellow-500 text-white font-semibold rounded-md mt-6"
              >
                {loading ? "Wysyłanie..." : "Wyślij"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
