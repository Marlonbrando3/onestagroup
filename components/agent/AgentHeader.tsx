import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaLayerGroup, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import Logotype from "@/public/logotype_full_new.png";

type AgentHeaderProps = {
  agentName?: string;
  active: "offers" | "presentations" | "editor";
};

export default function AgentHeader({ agentName, active }: AgentHeaderProps) {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/agentlogin");
  };

  const navClass = (selected: boolean) =>
    `flex h-10 items-center gap-2 rounded-full px-4 text-[10px] font-extrabold uppercase tracking-[0.09em] transition ${
      selected
        ? "bg-[#182334] text-white"
        : "text-[#526173] hover:bg-[#f2eee7] hover:text-[#182334]"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9cfbf] bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/agent" className="relative h-[48px] w-[154px] shrink-0">
            <Image
              src={Logotype}
              alt="Onesta Group"
              fill
              sizes="154px"
              className="object-contain"
              priority
            />
          </Link>
          <div className="hidden border-l border-[#ddd4c7] pl-5 sm:block">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9b7a36]">
              Strefa agenta
            </p>
            <p className="mt-1 max-w-[190px] truncate text-[13px] font-bold text-[#334155]">
              {agentName || "Ładowanie konta..."}
            </p>
          </div>
        </div>

        <nav className="order-3 flex w-full items-center justify-center gap-1 border-t border-[#eee8df] pt-3 md:order-none md:w-auto md:border-0 md:pt-0">
          <Link href="/agent" className={navClass(active === "offers")}>
            <FaPlus aria-hidden="true" />
            Wybierz oferty
          </Link>
          <Link
            href="/agent/prezentacje"
            className={navClass(active === "presentations" || active === "editor")}
          >
            <FaLayerGroup aria-hidden="true" />
            Prezentacje
          </Link>
        </nav>

        <button
          type="button"
          onClick={logout}
          className="flex h-10 items-center gap-2 rounded-full border border-[#d8d0c3] bg-white px-4 text-[10px] font-bold uppercase tracking-[0.09em] transition hover:border-[#182334]"
        >
          <FaSignOutAlt aria-hidden="true" />
          <span className="hidden sm:inline">Wyloguj</span>
        </button>
      </div>
    </header>
  );
}
