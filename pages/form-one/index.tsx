import FormOneLayout from "@/components/formOne/FormOneLayout";
import { FormOneHome } from "@/components/formOne/FormOneContent";

// Landing kampanii: /form-one (statyczny — bez wywołań funkcji serwera).
export default function FormOnePage() {
  return (
    <FormOneLayout
      title="Onesta — Twój adres w Hiszpanii"
      description="Wybierz budżet i porozmawiaj z Onesta o zakupie nieruchomości w Hiszpanii. Costa Blanca, Costa Cálida i Costa del Sol."
      canonicalPath="/form-one"
    >
      <FormOneHome />
    </FormOneLayout>
  );
}
