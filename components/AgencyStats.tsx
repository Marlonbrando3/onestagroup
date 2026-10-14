import { useEffect, useRef, useState } from "react";
import styles from "@/styles/aboutUs.module.css";

// Pasek liczb pod wyszukiwarką na /polskie-biuro-nieruchomosci-w-hiszpanii.
// Liczby są w HTML z serwera (SEO); po wejściu paska na ekran odliczają się od zera.

const COASTS = ["Costa Blanca", "Costa del Sol", "Costa Cálida", "Costa de Almería"];
const formatCount = (n: number) => n.toLocaleString("pl-PL");

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"idle" | "waiting" | "visible">("idle");
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setState("waiting");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, state };
}

function CountUp({ value, run }: { value: number; run: boolean }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!run) return;
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    setShown(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, value]);
  return <>{formatCount(shown)}</>;
}

export default function AgencyStats({
  totalOffers,
  newBuildOffers,
}: {
  totalOffers: number;
  newBuildOffers: number | null;
}) {
  const { ref, state } = useInView<HTMLDListElement>();
  const run = state === "visible";
  return (
    <section className={styles.statsBand} aria-label="Onesta Group w liczbach">
      <dl
        ref={ref}
        className={`${styles.stats} ${styles.statsAnimated}`}
        data-state={state}
      >
        <div>
          <dt>Ofert w Hiszpanii</dt>
          <dd><CountUp value={totalOffers} run={run} /></dd>
        </div>
        {newBuildOffers ? (
          <div>
            <dt>Z rynku pierwotnego</dt>
            <dd><CountUp value={newBuildOffers} run={run} /></dd>
          </div>
        ) : null}
        <div>
          <dt>Wybrzeża</dt>
          <dd className={styles.statText}>
            <ul className={styles.statCoasts}>
              {COASTS.map((coast) => (
                <li key={coast}>{coast}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Prowizja</dt>
          <dd className={styles.statText}>
            <span className={styles.statHighlight}>0&nbsp;zł</span> prowizji od kupującego
          </dd>
        </div>
      </dl>
    </section>
  );
}
