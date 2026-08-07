import Head from "next/head";
import PresentationEditor from "@/components/agent/PresentationEditor";

export default function NewPresentationPage() {
  return (
    <>
      <Head>
        <title>Konfiguracja prezentacji | Onesta Group</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <PresentationEditor />
    </>
  );
}
