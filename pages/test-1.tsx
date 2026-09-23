import Head from "next/head";
import Dossier from "@/components/dossier/Dossier";
import { dossierDemo } from "@/data/dossierDemo";

export default function DossierPreview() {
  return <>
    <Head>
      <title>Dossier · REF {dossierDemo.reference} | Onesta Group</title>
      <meta name="description" content="Broszura informacyjna nieruchomości Onesta Group. Projekt, lokalizacja, dostępność i przewodnik po zakupie." />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Dossier offer={dossierDemo} />
  </>;
}
