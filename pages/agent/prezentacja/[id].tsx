import Head from "next/head";
import { useRouter } from "next/router";
import PresentationEditor from "@/components/agent/PresentationEditor";

export default function EditPresentationPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";

  return (
    <>
      <Head>
        <title>Edycja prezentacji | Onesta Group</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {id ? <PresentationEditor presentationId={id} /> : null}
    </>
  );
}
