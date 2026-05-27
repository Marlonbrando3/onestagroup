import Head from "next/head";
import Image from "next/image";
import { MontserratSans } from "@/fonts/fonts";

const stepCards = [
  {
    number: "1",
    text: "Współpracujemy ze wszystkimi deweloperami na wybrzeżach Costa Blanca, Costa Calida, Costa del Sol oraz PONAD 100 agencjami lokalnymi oferując szeroki dostęp do blisko 3000 ofert z rynku wtórnego.",
  },
  {
    number: "2",
    text: "Prowadzimy proces zakupu nieruchomości począwszy od prezentacji przez weryfikację dokumentów, wyrobienie numeru N.I.E, konta w banku formalizację zakupu zakończoną aktem notarialnym.",
  },
  {
    number: "3",
    text: "Na życzenie projektujemy wnętrza i meblujemy nieruchomości po czym jest ona gotowa do zamieszkania lub dalszego zarządzania najmem również prowadzonego przez odpowiedni dział w ramach naszej grupy.",
  },
  {
    number: "4",
    text: "W ramach zarządzania najmem korzystamy z własnego portalu i/lub popularnych tj. Booking, Airbnb oraz rekomendacji.",
  },
];

const rentServices = [
  "Profesjonalne sprzątanie po każdej rezerwacji",
  "Wymiana i przygotowanie pościeli, ręczników oraz",
  "Sprawdzenie wyposażenia i czystości przed przyjazdem",
  "Standard hotelowy + zestaw środków higienicznych",
  "Przygotowanie dokumentów do rejestracji gości w Guarda Civil",
  "Dbałość o jakość doświadczenia gości i budowanie",
  "Usługę rezydenta oraz pakiet powitalny dla gości",
];

const whyUs = [
  "Ponad 8 lat doświadczenia na rynku Hiszpańskim.",
  "Reprezentowanie Państwa pośród agencji lub deweloperów.",
  "Możliwość reprezentowania Państwa w zakupie nieruchomości znalezionej na innych portalach",
  "Nie pobieramy prowizji od klientów kupujących",
  "Nastawienie na realizację Państwa celu, nie celu sprzedaży.",
  "Szeroką bazę ofert z rynku pierwotnego i wtórnego.",
  "Selekcję ofert, prezentację, kompletny proces zakupu.",
  "Umeblowanie oraz dalsze zarządzanie najmem (opcjonalnie)",
  "Zaplecze prawne w procesie zakupu.",
];

const galleryImages = [
  { src: "/contactformbg.webp", className: "h-[210px] lg:h-[360px]" },
  { src: "/middleOne.webp", className: "h-[250px] lg:h-[430px]" },
  { src: "/main_img_video.webp", className: "h-[250px] lg:h-[430px]" },
  { src: "/bg_about.jpeg", className: "h-[210px] lg:h-[360px]" },
  { src: "/Higuericas/planes_1.png", className: "h-[230px] lg:h-[390px]" },
  { src: "/Higuericas/Location.jpg", className: "h-[230px] lg:h-[390px]" },
];

function AccentHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-[12px] ${className}`}>
      <span className="mt-[5px] h-[43px] w-[5px] shrink-0 bg-[#f15b2a] lg:h-[62px] lg:w-[7px]" />
      <h2 className="text-[25px] font-[700] leading-[1.12] tracking-[-0.3px] lg:text-[46px]">
        {children}
      </h2>
    </div>
  );
}

function YellowPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-[#ffc329] px-[16px] py-[11px] text-[14px] font-[600] leading-[1.35] shadow-[0_2px_0_rgba(0,0,0,0.08)] lg:rounded-[22px] lg:px-[28px] lg:py-[18px] lg:text-[22px]">
      {children}
    </div>
  );
}

export default function DesignPage() {
  return (
    <>
      <Head>
        <title>Onesta Design</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main
        className={`${MontserratSans.className} min-h-screen bg-white text-[#171717]`}
      >
        <div className="min-h-screen w-full overflow-hidden bg-[#ffc329]">
          <section className="relative min-h-[620px] bg-[#ffc329] px-[24px] py-[26px] lg:min-h-[760px] lg:px-[70px] lg:py-[46px]">
            <div className="absolute right-0 top-0 h-full w-[42%] bg-[#f3e8df] [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />

            <div className="relative z-10 mx-auto grid h-full max-w-[1440px] grid-cols-1 gap-[26px] lg:grid-cols-[56%_44%]">
              <div>
                <div className="flex h-[46px] w-[158px] items-center rounded-full bg-white px-[16px] shadow-sm lg:h-[62px] lg:w-[220px] lg:px-[24px]">
                  <Image
                    src="/logotype_full_new.png"
                    alt="Onesta"
                    width={220}
                    height={70}
                    className="h-auto w-full object-contain"
                    priority
                  />
                </div>

                <div className="mt-[72px] max-w-[710px] border-l-[6px] border-[#f15b2a] pl-[18px] lg:mt-[46px] lg:border-l-[9px] lg:pl-[34px]">
                  <p className="text-[20px] font-[700] leading-none lg:text-[30px]">
                    Od ponad 8 lat
                  </p>
                  <h1 className="mt-[16px] text-[34px] font-[800] leading-[1.04] tracking-[-1px] lg:mt-[28px] lg:text-[50px] lg:tracking-[-2.4px]">
                    Pomagamy Polakom w poszukiwaniach i zakupie drugiego domu w
                    Hiszpanii
                  </h1>
                  <button className="mt-[26px] rounded-full bg-black px-[25px] py-[13px] text-[11px] font-[700] uppercase tracking-[0.5px] text-white lg:mt-[40px] lg:px-[42px] lg:py-[20px] lg:text-[16px]">
                    Sprawdź jak możemy Ci pomóc
                  </button>
                  <p className="mt-[13px] text-[10px] font-[500] uppercase tracking-[0.1px] lg:mt-[20px] lg:text-[14px]">
                    lub zostaw kontakt{" "}
                    <span className="font-[800]">klikając tutaj</span>
                  </p>
                </div>
              </div>

              <div className="relative min-h-[270px] lg:min-h-[650px]">
                <div className="absolute right-[96px] top-[4px] h-[178px] w-[178px] overflow-hidden rounded-[30px] border-[8px] border-[#ffc329] bg-white shadow-sm lg:right-[220px] lg:top-[56px] lg:h-[310px] lg:w-[310px] lg:rounded-[46px] lg:border-[14px]">
                  <Image
                    src="/Marek.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 178px, 310px"
                    className="object-cover object-[50%_12%]"
                    priority
                  />
                </div>
                <div className="absolute right-[12px] top-[124px] h-[188px] w-[188px] overflow-hidden rounded-[30px] border-[8px] border-[#ffc329] bg-white shadow-sm lg:right-[34px] lg:top-[302px] lg:h-[340px] lg:w-[340px] lg:rounded-[46px] lg:border-[14px]">
                  <Image
                    src="/Karolina.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 188px, 340px"
                    className="object-cover object-[50%_10%]"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#f3e8df] px-[24px] pb-[54px] pt-[48px] lg:px-[70px] lg:pb-[92px] lg:pt-[86px]">
            <div className="mx-auto max-w-[1380px]">
              <AccentHeading>
                <span>
                  <span className="text-[#ffc329]">KAŻDY</span> etap zakupu w{" "}
                  <span className="text-[#ffc329]">JEDNYM</span> miejscu
                </span>
              </AccentHeading>

              <div className="mt-[32px] grid grid-cols-1 gap-[20px] lg:mt-[58px] lg:grid-cols-2 lg:gap-[28px]">
                {stepCards.map((card) => (
                  <article
                    key={card.number}
                    className="relative flex min-h-[170px] overflow-hidden rounded-[28px] bg-[#ffc329] px-[22px] py-[22px] lg:min-h-[230px] lg:rounded-[38px] lg:px-[34px] lg:py-[34px]"
                  >
                    <div className="mr-[18px] shrink-0 text-[96px] font-[800] leading-[0.85] text-white/65 lg:mr-[28px] lg:text-[170px]">
                      {card.number}
                    </div>
                    <p className="relative z-10 self-center text-[14px] font-[600] leading-[1.45] lg:text-[22px]">
                      {card.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#ffc329] px-[24px] pb-[58px] pt-[50px] lg:px-[70px] lg:pb-[96px] lg:pt-[82px]">
            <div className="mx-auto max-w-[1380px]">
              <AccentHeading>
                Przykłady umeblowania w apartamentach na wynajem.
              </AccentHeading>

              <div className="mt-[32px] grid grid-cols-2 gap-[14px] lg:mt-[54px] lg:grid-cols-3 lg:gap-[24px]">
                {galleryImages.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className={`relative overflow-hidden rounded-[22px] bg-[#f3e8df] lg:rounded-[34px] ${image.className}`}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 430px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#f3e8df] px-[24px] py-[52px] lg:px-[70px] lg:py-[88px]">
            <div className="mx-auto max-w-[1240px]">
              <AccentHeading>
                Usługa zarządzania najmem obejmuje m.in:
              </AccentHeading>
              <div className="mt-[28px] flex flex-col gap-[12px] lg:mt-[46px] lg:gap-[18px]">
                {rentServices.map((item) => (
                  <YellowPill key={item}>{item}</YellowPill>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#f3e8df] px-[24px] pb-[62px] pt-[8px] lg:px-[70px] lg:pb-[98px]">
            <div className="mx-auto max-w-[1240px]">
              <AccentHeading>Dlaczego my?</AccentHeading>
              <div className="mt-[30px] grid grid-cols-1 gap-[24px] lg:mt-[52px] lg:grid-cols-[330px_1fr] lg:gap-[48px]">
                <div className="relative h-[260px] overflow-hidden rounded-[24px] bg-[#ffc329] lg:h-[430px] lg:rounded-[34px]">
                  <Image
                    src="/Przemek.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 330px"
                    className="object-cover object-[50%_12%]"
                  />
                </div>
                <p className="text-[14px] italic leading-[1.55] lg:text-[24px]">
                  Rozumiemy, że zakup nieruchomości za granicą może wiązać się
                  ze stresem co do bezpieczeństwa całego procesu, trafności
                  wyboru, lokalizacji, a nierzadko brakiem znajomości rynku.
                  Chodzi przecież o spełnienie marzenia lub podjęcie często
                  złożonej decyzji, która w efekcie powinna dawać nie tylko
                  satysfakcje ale również pozwalać na efektywny wynajem.
                  <br />
                  <br />
                  To na czym nam zależy to pełna swoboda i otwartości w
                  komunikacji z klientami budowana na wzajemnym zaufaniu.
                </p>
              </div>

              <AccentHeading className="mt-[42px] lg:mt-[76px]">
                Dlatego chcemy zaoferować Państwu:
              </AccentHeading>
              <div className="mt-[28px] flex flex-col gap-[12px] lg:mt-[46px] lg:gap-[18px]">
                {whyUs.map((item) => (
                  <YellowPill key={item}>{item}</YellowPill>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#ffc329] px-[24px] pb-[62px] pt-[50px] lg:px-[70px] lg:pb-[100px] lg:pt-[84px]">
            <div className="mx-auto max-w-[1380px]">
              <AccentHeading>Przykładowe oferty</AccentHeading>
              <div className="mt-[32px] grid grid-cols-2 gap-[16px] lg:mt-[54px] lg:grid-cols-3 lg:gap-[26px]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[220px] rounded-[24px] bg-[#f3e8df] lg:h-[360px] lg:rounded-[38px]"
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#ffc329] px-[24px] pb-[78px] pt-[12px] lg:px-[70px] lg:pb-[120px]">
            <div className="mx-auto max-w-[1180px] rounded-[30px] bg-[#f3e8df] px-[28px] py-[30px] lg:rounded-[46px] lg:px-[70px] lg:py-[64px]">
              <AccentHeading>
                Zacznijmy od rozmowy. Zostaw nam kilka informacji
              </AccentHeading>

              <form className="mt-[27px] flex flex-col gap-[12px] lg:mt-[50px] lg:gap-[18px]">
                <input
                  className="h-[44px] rounded-[13px] border border-black/10 bg-white px-[14px] text-[13px] outline-none lg:h-[62px] lg:rounded-[18px] lg:px-[22px] lg:text-[18px]"
                  placeholder="Imię i nazwisko"
                />
                <input
                  className="h-[44px] rounded-[13px] border border-black/10 bg-white px-[14px] text-[13px] outline-none lg:h-[62px] lg:rounded-[18px] lg:px-[22px] lg:text-[18px]"
                  placeholder="Adres e-mail"
                />
                <input
                  className="h-[44px] rounded-[13px] border border-black/10 bg-white px-[14px] text-[13px] outline-none lg:h-[62px] lg:rounded-[18px] lg:px-[22px] lg:text-[18px]"
                  placeholder="Numer telefonu"
                />
                <textarea
                  className="h-[130px] resize-none rounded-[13px] border border-black/10 bg-white px-[14px] py-[13px] text-[13px] outline-none lg:h-[210px] lg:rounded-[18px] lg:px-[22px] lg:py-[20px] lg:text-[18px]"
                  placeholder="Wiadomość"
                />
                <button
                  type="button"
                  className="mt-[5px] h-[45px] rounded-full bg-black text-[13px] font-[700] uppercase tracking-[0.4px] text-white lg:h-[62px] lg:text-[18px]"
                >
                  Wyślij
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
