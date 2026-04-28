export default function ListingsPage(props: PageProps) {
  const router = useRouter();
  const { country } = router.query;

  const searchEngine = useRef<HTMLDivElement>(null);
  const mobileButtonSearchEngine = useRef<HTMLButtonElement>(null);

  const [loader, setLoader] = useState(false);
  const [propertiesState, setPropertiesState] = useState<Property[]>(
    props.properties ?? [],
  );
  const [pageState, setPageState] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const handleConsultationPopUp = () => setConsultationOpen((prev) => !prev);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = (node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageState((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  // 🔥 FIX PĘTLI
  useEffect(() => {
    const incoming = props.properties ?? [];

    if (incoming.length === propertiesState.length) return;

    setPropertiesState(incoming);
    setPageState(1);
    setHasMore(true);
  }, [props.properties]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      searchEngine.current
    ) {
      searchEngine.current.style.top = "-120vh";
    }
  }, []);

  // 🔥 ZAPIS SCROLLA PRZY WYJŚCIU
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem("scrollY", String(window.scrollY));
    };

    window.addEventListener("pagehide", saveScroll);

    return () => {
      window.removeEventListener("pagehide", saveScroll);
    };
  }, []);

  // 🔥 PRZYWRACANIE SCROLLA
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = sessionStorage.getItem("scrollY");

    document.body.style.overflow = "hidden";

    if (saved) {
      const y = Number(saved);

      window.scrollTo(0, y);

      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    }

    setTimeout(() => {
      document.body.style.overflow = "";
    }, 50);
  }, []);

  if (!country || typeof country !== "string") return null;

  const handleShowMobileFilters = () => {
    if (!searchEngine.current || !mobileButtonSearchEngine.current) return;
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;

    const next = !isMobileFiltersOpen;
    setIsMobileFiltersOpen(next);

    searchEngine.current.style.top = next ? "0px" : "-120vh";
    mobileButtonSearchEngine.current.innerHTML = next ? "Zamknij" : "Filtry";
  };

  const title = `Nieruchomości ${country.toUpperCase()}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <WhatsAppButton />
      <Consultation
        handleConsultationPopUp={handleConsultationPopUp}
        ConsultationsShowed={consultationOpen}
      />
      <HeaderListings handleConsultationPopUp={handleConsultationPopUp} />
      <MiniHomeView />

      <SearchEngine
        loader={loader}
        setLoader={setLoader}
        handleShowMobileFilters={handleShowMobileFilters}
        searchEngine={searchEngine}
        mobileButtonSearchEngine={mobileButtonSearchEngine}
        count={props.totalCount}
        {...props}
        properties={propertiesState}
        isMobileFiltersOpen={isMobileFiltersOpen}
        setIsMobileFiltersOpen={setIsMobileFiltersOpen}
      />

      <div ref={lastElementRef} style={{ height: 50 }} />

      {loadingMore && (
        <div className="flex items-center justify-center gap-2 mb-[50px]">
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-6 h-6 bg-yellow-500 rounded-full animate-bounce" />
        </div>
      )}

      <ContactFormMain />
      <Footer />
    </>
  );
}
