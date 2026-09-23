import Image from "next/image";
import type { ReactNode } from "react";

export default function MiniHomeView({ children }: { children?: ReactNode }) {
  return (
    <section className="relative mb-4 w-full overflow-hidden bg-white lg:mb-0 lg:h-[270px] lg:bg-[#dceaf2]">
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
        <Image
          src="/mediterranean-property-banner.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover brightness-[1.06] contrast-[1.03] saturate-[1.16]"
          style={{ objectPosition: "center 52%" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,27,40,0.62)_0%,rgba(12,27,40,0.48)_32%,rgba(12,27,40,0.24)_65%,rgba(12,27,40,0.08)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102131]/15 via-transparent to-white/5" />
      </div>

      <div className="relative mx-auto flex h-full w-[90vw] max-w-[1300px] flex-col justify-center py-5 text-[#182334] lg:pt-8 lg:pb-24 lg:text-white lg:drop-shadow-[0_2px_5px_rgba(0,0,0,0.62)]">
        {children}
      </div>
    </section>
  );
}
