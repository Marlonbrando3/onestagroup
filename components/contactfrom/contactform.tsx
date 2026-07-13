import React from "react";
import Form from "./form";
import type { SiteLocale } from "@/lib/i18n";

type ContactformProps = {
  locale?: SiteLocale;
};

export default function Contactform({ locale = "pl" }: ContactformProps) {
  return (
    <div id="c" className="w-full">
      <Form locale={locale} />
    </div>
  );
}
