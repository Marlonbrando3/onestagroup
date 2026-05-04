import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

type PopupStep = "initial" | "form";

interface FormData {
  budgetMax: string;
  email: string;
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
  });

  const handleBrowsingOnly = () => {
    onClose();
    setStep("initial");
  };

  const handleRequestOffers = () => {
    setStep("form");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to send email with form data
    console.log("Form data:", formData);
    onClose();
    setStep("initial");
    setFormData({ budgetMax: "", email: "" });
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
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
              Nie wiesz co wybrać?{" "}
              <p className="text-[16px]">Zamów to 10 ofert w Twoim bużecie.</p>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksymalny budżet (€)
                </label>
                <input
                  type="number"
                  name="budgetMax"
                  value={formData.budgetMax}
                  onChange={handleInputChange}
                  placeholder="np. 500000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="twoj@email.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors mt-6"
              >
                Wyślij
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
