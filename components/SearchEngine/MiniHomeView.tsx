import Image from "next/image";
import type { ReactNode } from "react";

export default function MiniHomeView({ children }: { children?: ReactNode }) {
  return (
    <section className="relative mb-4 w-full overflow-hidden bg-white lg:mb-0 lg:h-[270px] lg:bg-[#182334]">
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
        <Image
          src="/mediterranean-property-banner.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover"
          style={{ objectPosition: "center 52%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101a2b]/85 via-[#101a2b]/55 to-[#101a2b]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101a2b]/25 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-full w-[90vw] max-w-[1300px] flex-col justify-center py-5 text-[#182334] lg:pt-8 lg:pb-24 lg:text-white">
        {children}
      </div>
    </section>
  );
}
