import { supabase } from "../lib/supabaseClient";
import { canAccessCrm } from "../components/crm/users";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function LoginCrm() {
  const router = useRouter();
  const email = useRef();
  const password = useRef();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    const emailValue = email.current.value;
    const { error } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password: password.current.value,
    });

    if (error) {
      setErrorMessage("Błąd logowania");
      return;
    }

    if (!canAccessCrm(emailValue)) {
      await supabase.auth.signOut();
      setErrorMessage("Brak dostępu do CRM dla tego konta.");
      return;
    }

    const redirect = typeof router.query.redirect === "string" ? router.query.redirect : "/crm";
    router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-[420px] flex flex-col p-6 rounded-lg shadow-lg">
        <div className="text-center text-xl pb-5 font-bold">Logowanie CRM</div>
        {errorMessage ? (
          <div className="w-full min-h-10 bg-red-600 text-white text-center leading-10 mb-3 rounded-md">
            {errorMessage}
          </div>
        ) : null}
        <label id="logincrm-email">Adres e-mail</label>
        <input
          ref={email}
          name="email"
          type="email"
          className="border-2 rounded-md mb-3 h-10 px-2"
        />
        <label id="logincrm-pass">Hasło</label>
        <input
          ref={password}
          name="pass"
          type="password"
          className="border-2 rounded-md h-10 px-2"
        />
        <button
          type="submit"
          onClick={handleLogin}
          name="submit"
          className="mt-6 h-10 bg-green-700 text-white rounded-md font-bold"
        >
          Zaloguj do CRM
        </button>
      </div>
    </div>
  );
}
