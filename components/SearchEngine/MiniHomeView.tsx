import Image from "next/image";

export default function MiniHomeView() {
  return (
    <div
      aria-hidden="true"
      className="relative mb-[15px] hidden h-[160px] w-full overflow-hidden rounded-b-[40px] bg-[#e8ddca] lg:block"
    >
      <Image
        src="/mediterranean-property-banner.webp"
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className="object-cover"
        style={{ objectPosition: "center 52%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#182334]/10 to-transparent" />
    </div>
  );
}
