import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { FaArrowLeft, FaLock, FaRegUser } from "react-icons/fa";
import { HomeMontserratSans, HomePlayfairSans } from "@/fonts/homeFonts";
import { supabase } from "@/lib/supabaseClient";
import Logotype from "@/public/logotype_full_new.png";

export default function AgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accessError =
    router.isReady && router.query.error === "access"
      ? "To konto nie ma dostępu do panelu agenta."
      : "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage("Nieprawidłowy adres e-mail lub hasło.");
      return;
    }

    const requestedRedirect =
      typeof router.query.redirect === "string" ? router.query.redirect : "/agent";
    const safeRedirect =
      requestedRedirect.startsWith("/") && !requestedRedirect.startsWith("//")
        ? requestedRedirect
        : "/agent";

    await router.replace(safeRedirect);
  };

  return (
    <>
      <Head>
        <title>Konto agenta | Onesta Group</title>
        <meta
          name="description"
          content="Logowanie do konta agenta Onesta Group."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main
        className={`${HomeMontserratSans.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4efe6] px-5 py-10 text-[#182334]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,149,76,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(24,35,52,0.12),transparent_38%)]" />
        <div className="absolute -left-28 bottom-[-180px] h-[420px] w-[420px] rounded-full border border-[#b8954c]/25" />
        <div className="absolute -right-24 top-[-190px] h-[460px] w-[460px] rounded-full border border-[#182334]/10" />

        <section className="relative grid w-full max-w-[1040px] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(24,35,52,0.16)] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative hidden min-h-[650px] overflow-hidden bg-[#182334] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(184,149,76,0.28),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_38%)]" />

            <Link
              href="/"
              aria-label="Onesta Group — strona główna"
              className="relative block h-[58px] w-[190px] rounded-xl bg-white px-3"
            >
              <Image
                src={Logotype}
                alt="Onesta Group"
                fill
                sizes="190px"
                className="object-contain p-2"
                priority
              />
            </Link>

            <div className="relative max-w-[380px]">
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#d6b66f]/70 bg-white/10 text-[23px] text-[#e0c280]">
                <FaRegUser aria-hidden="true" />
              </div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d6b66f]">
                Strefa współpracy
              </p>
              <h1 className={`${HomePlayfairSans.className} text-[48px] leading-[1.05]`}>
                Konto agenta Onesta
              </h1>
              <p className="mt-6 text-[14px] leading-7 text-slate-300">
                Bezpieczny dostęp dla agentów i współpracowników posiadających
                aktywne konto w systemie Onesta.
              </p>
            </div>

            <p className="relative text-[11px] leading-5 text-slate-400">
              Dostęp do kont jest nadawany przez administratora Onesta Group.
            </p>
          </div>

          <div className="flex min-h-[650px] flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link
                href="/"
                aria-label="Onesta Group — strona główna"
                className="relative block h-[52px] w-[164px]"
              >
                <Image
                  src={Logotype}
                  alt="Onesta Group"
                  fill
                  sizes="164px"
                  className="object-contain"
                  priority
                />
              </Link>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7c8ad] text-[#182334]">
                <FaRegUser aria-hidden="true" />
              </div>
            </div>

            <Link
              href="/"
              className="mb-9 inline-flex w-fit items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#7b6844] transition hover:text-[#182334]"
            >
              <FaArrowLeft aria-hidden="true" />
              Wróć na stronę
            </Link>

            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9b7a36]">
                  Konto agenta
                </p>
                <h2 className={`${HomePlayfairSans.className} mt-3 text-[40px] leading-tight sm:text-[46px]`}>
                  Zaloguj się
                </h2>
                <p className="mt-4 text-[14px] leading-6 text-slate-500">
                  Wprowadź dane konta utworzonego przez administratora.
                </p>

                <form className="mt-9 grid gap-5" onSubmit={handleSubmit}>
                  <label className="grid gap-2 text-[12px] font-bold text-[#334155]">
                    Adres e-mail
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-[52px] rounded-xl border border-[#d8d0c3] bg-[#fcfbf8] px-4 text-[14px] font-medium text-[#182334] outline-none transition placeholder:text-slate-400 focus:border-[#b8954c] focus:ring-4 focus:ring-[#b8954c]/10"
                      placeholder="agent@onesta.com.pl"
                    />
                  </label>

                  <label className="grid gap-2 text-[12px] font-bold text-[#334155]">
                    Hasło
                    <input
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-[52px] rounded-xl border border-[#d8d0c3] bg-[#fcfbf8] px-4 text-[14px] font-medium text-[#182334] outline-none transition placeholder:text-slate-400 focus:border-[#b8954c] focus:ring-4 focus:ring-[#b8954c]/10"
                      placeholder="Wpisz hasło"
                    />
                  </label>

                  {errorMessage || accessError ? (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700"
                    >
                      {errorMessage || accessError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#182334] px-6 text-[12px] font-bold uppercase tracking-[0.13em] text-white shadow-[0_14px_28px_rgba(24,35,52,0.18)] transition hover:bg-[#b8954c] disabled:cursor-wait disabled:opacity-60"
                  >
                    <FaLock aria-hidden="true" />
                    {isSubmitting ? "Logowanie..." : "Zaloguj się"}
                  </button>
                </form>

                <p className="mt-7 text-center text-[11px] leading-5 text-slate-400">
                  Nie ma możliwości samodzielnej rejestracji konta.
                </p>
              </div>
          </div>
        </section>
      </main>
    </>
  );
}
