import { useRef } from "react";
import { supabaseServer } from "@/lib/supabaseClient";
import Head from "next/head";
import Header from "../../../../components/Header";
import { useRouter } from "next/router";
import { useState } from "react";
import Descryption from "../../../../components/Descryption";
import Footer from "@/components/Footer";
import { OutfitSans, PlayfairSans } from "../../../../fonts/fonts";
import Form from "@/components/SearchEngine/IntresetedPopUp/form";
import { IoClose } from "react-icons/io5";
import WhatsAppButton from "@/components/whatsapp/whatsappButton";
import Slider from "@/components/SliderInOfferPage/slider";
import Gallery from "@/components/SliderInOfferPage/gallery";
import ContactInFooterMobile from "@/components/SearchEngine/ContactInFooterMobile";
import { validTitleOrEmpty } from "@/lib/titlesDictionary";
import { propertyTypeLabel, SiteLocale } from "@/lib/i18n";
import { propertyImageUrl } from "@/lib/propertyImages";

const PROPERTY_DETAIL_COLUMNS = [
  "external_id",
  "type",
  "town",
  "province",
  "country",
  "price",
  "beds",
  "baths",
  "pool",
  "images",
  "title",
  "features",
  "latitude",
  "longitude",
  "description_pl:descriptions->>pl",
  "description_en:descriptions->>en",
].join(",");

export default function Property({
  propertyFromSupabase,
  locale = "pl",
}: {
  propertyFromSupabase: any;
  locale?: SiteLocale;
}) {
  const router = useRouter();
  const isEn = locale === "en";

  const [propertyData, setPropertyData] = useState<any[]>([]);
  // const [PropertyImages, setPropertyImages] = useState<any[]>([]);

  const intrestedPopUp: any = useRef();

  const [images, setImages] = useState<any[]>();
  const [choosedImage, setChoosedImage] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  let showedImage: any | undefined;
  const { title } = router.query;

  const typeLabel =
    propertyTypeLabel[locale][propertyFromSupabase?.type] ||
    (isEn ? "Property" : "Nieruchomość");
  const generatedTitle = isEn
    ? `${typeLabel} in ${propertyFromSupabase?.town || "Spain"}`
    : `${typeLabel} w ${propertyFromSupabase?.town || "Hiszpanii"}`;
  const listingTitle =
    validTitleOrEmpty(propertyFromSupabase?.title) ||
    validTitleOrEmpty(propertyFromSupabase?.headerAdvertisement) ||
    generatedTitle;

  if (images !== undefined) {
    images?.filter((img) => {
      if (img.showed === true) {
        showedImage = img.image.replace("thumbnail", "normal");
      }
    });
  }

  const handleShowingGallery = () => {
    setShowGallery(true);
  };

  const imagesMiniData = propertyFromSupabase.images
    ?.slice(1, 5)
    .map((i: any, index: any) => {
      return (
        <div
          key={i["@_id"]}
          className="lg:w-[170px] lg:h-[176px] md:w-[121px] md:h-[122px] w-[15vw] h-[10vw] relative cursor-pointer hover:brightness-125 duration-100"
          onClick={handleShowingGallery}
        >
          <img
            src={propertyImageUrl(i)}
            alt="alt"
            className="absolute inset-0 h-full w-full rounded-md object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      );
    });

  const handleClosingIntresetedPopUp = () => {
    intrestedPopUp.current.style.display = "none";
  };

  return (
    <>
      <Head>
        <title>{listingTitle} | Onesta Group</title>
        <meta
          name="description"
          content={
            isEn
              ? `${listingTitle}. View details, photos and contact Onesta Group about this overseas property.`
              : `${listingTitle}. Sprawdź szczegóły oferty nieruchomości z Onesta Group.`
          }
        />
        <link rel="shortcut icon" href="/logotype.png" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&family=Nunito+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div
        className={`${OutfitSans.className} max-w-[1350px] flex flex-col mx-[5px] sm:mx-auto relative overflow-x-hidden mt-[80px] `}
      >
        {showGallery && !showSlider ? (
          <Gallery
            choosedImage={choosedImage}
            setChoosedImage={setChoosedImage}
            showSlider={showSlider}
            setShowSlider={setShowSlider}
            showGallery={showGallery}
            setShowGallery={setShowGallery}
            images={propertyFromSupabase.images}
          />
        ) : null}
        {showSlider ? (
          <Slider
            showSlider={showSlider}
            choosedImage={choosedImage}
            setChoosedImage={setChoosedImage}
            setShowSlider={setShowSlider}
            images={propertyFromSupabase.images}
            propertyDetails={propertyFromSupabase}
          />
        ) : null}
        <WhatsAppButton />
        <div
          ref={intrestedPopUp}
          id="intrestedPopUp"
          className="hidden w-full h-full fixed z-40 top-0 bottom-0 left-0 right-0 m-auto shadow-[10px_25px_60px_20px_rgba(0,0,0,0.3)] bg-gray-900/[0.6] justify-center items-center"
        >
          <div className="md:w-[800px] w-[90%] h-[500px] relative">
            <IoClose
              onClick={handleClosingIntresetedPopUp}
              className="absolute right-[10px] top-[10px] z-[70] cursor-pointer"
            />
            <Form
              intrestedPopUp={intrestedPopUp}
              OfferNumber={propertyData[0]?.listingId}
            />
          </div>
        </div>
        <Header locale={locale} />
        {/* <MiniHomeViewOffer /> */}
        <div className="lg:w-full md:w-[95vw] w-full pt-5 md:pt-auto mx-auto my-0 rounded-md bg-white">
          <div
            className={`${PlayfairSans.className} pb-[20px] font-[500] tracking-[0.6px] scale-x-[0.9] scale-y-[1.04] md:-ml-[55px] md:text-[36px] text-[32px] leading-[34px]`}
          >
            {listingTitle}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center">
            {/* MAIN GALLERY IMAGE */}
            <div className="md:flex-1 md:h-[255px] lg:h-[360px] md:w-[60vw] h-[200px] overflow-hidden mx-[10px]">
              <div className="flex md:h-full sm:h-full h-[900px] w-full flex-col justify-between rounded-md overflow-hidden">
                <div className="lg:w-full md:w-full md:h-[500px] h-[200px] w-[95vw] sm:block select-none relative mx-auto relative rounded-md cursor-pointer">
                  <img
                    className="absolute inset-0 h-full w-full rounded-md object-cover"
                    src={propertyImageUrl(propertyFromSupabase.images[0])}
                    alt="nieruchomosci-w-hiszpanii"
                    onClick={handleShowingGallery}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>
            {/* mini-gallery */}
            <div className="flex md:justify-start justify-between items-start lg:w-[570px] md:w-[400px] w-[95vw] lg:flex-none  flex-wrap lg:gap-2 md:gap-3 gap-0  mt-[5px] md:mt-auto">
              {imagesMiniData}
            </div>
          </div>
        </div>
        {/* <Features /> */}
        <Descryption
          localization={{
            lat: propertyFromSupabase.latitude,
            lng: propertyFromSupabase.longitude,
          }}
          propertyData={propertyFromSupabase}
          features={propertyFromSupabase.features}
          description={propertyFromSupabase.descriptions.pl}
          descriptionEN={propertyFromSupabase.descriptions.en}
          locale={locale}
          bedrooms={propertyFromSupabase.beds}
          bathrooms={propertyFromSupabase.baths}
          distance={propertyData[0]?.distance}
          pool={propertyFromSupabase.pool}
          propertyId={propertyData[0]?.id}
          propertyRef={propertyFromSupabase.external_id}
          propertyPrice={propertyFromSupabase.price}
          propertType={propertyFromSupabase.type}
        />
        <ContactInFooterMobile
          propertyRef={propertyFromSupabase.external_id}
          locale={locale}
        />
        <Footer locale={locale} />
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const id = String(context.query.id || "").trim();

  if (!id || id.length > 180) return { notFound: true };

  if (!supabaseServer) {
    return { notFound: true };
  }

  const { data, error } = await supabaseServer
    .from("properties")
    .select(PROPERTY_DETAIL_COLUMNS)
    .eq("external_id", id)
    .maybeSingle();

  if (error || !data) {
    console.error(error);
    return { notFound: true };
  }

  const propertyRecord = data as unknown as Record<string, any>;
  let normalizedImages = propertyRecord.images;
  try {
    if (typeof normalizedImages === "string") {
      normalizedImages = JSON.parse(normalizedImages);
    }
  } catch {
    normalizedImages = [];
  }

  const { description_pl, description_en, ...propertyData } = propertyRecord;
  const normalizedData = {
    ...propertyData,
    images: Array.isArray(normalizedImages)
      ? normalizedImages
      : normalizedImages
        ? [normalizedImages]
        : [],
    descriptions: {
      pl: description_pl || "",
      en: description_en || "",
    },
  };

  context.res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=900, stale-while-revalidate=86400",
  );

  return {
    props: {
      propertyFromSupabase: normalizedData ?? null,
    },
  };
}
