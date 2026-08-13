import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Login() {
  const router = useRouter();

  const email = useRef();
  const password = useRef();
  const info = useRef();
  const [comm, setComm] = useState();

  const getSafeRedirect = () => {
    const redirect =
      typeof router.query.redirect === "string" ? router.query.redirect : "";

    if (redirect.startsWith("/") && !redirect.startsWith("//")) {
      return redirect;
    }

    return "/admin";
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.current.value,
      password: password.current.value,
    });

    if (!error) {
      router.push(getSafeRedirect());
    } else {
      alert("Błąd logowania");
    }
  };

  return (
    <div className="bg-gray-100 w-[500px] flex flex-col p-5 mx-auto mt-52">
      <div className="text-center text-lg pb-5 font-bold">Logowanie</div>
      <div
        ref={info}
        className="invisible w-full h-10 bg-red-600 text-white text-center leading-10"
      >
        {comm}
      </div>
      <label id="login">Adres e-mail</label>
      <input
        ref={email}
        name="email"
        type="email"
        autoComplete="email"
        className="border-2 rounded-md mb-3 h-10"
      ></input>
      <label id="pass">Hasło</label>
      <input
        ref={password}
        name="pass"
        type="password"
        autoComplete="current-password"
        className="border-2 rounded-md h-10"
      ></input>
      <button
        type="submit"
        onClick={handleLogin}
        name="submit"
        className="mt-6 h-10 bg-green-600 text-white rounded-md font-bold"
      >
        Zaloguj się
      </button>
    </div>
  );
}
