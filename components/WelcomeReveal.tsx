import { useEffect, useRef, useState } from "react";
import styles from "@/styles/polishAgency.module.css";

// „Witaj w Onesta Group” nad sekcją „Co dla Ciebie zrobimy?” — pochylony napis,
// który szybko „rozwija się” od lewej, gdy pojawi się na ekranie.
export default function WelcomeReveal() {
  const ref = useRef<HTMLParagraphElement>(null);
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
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={ref} className={styles.welcome} data-state={state}>
      <span className={styles.welcomeText}>Witaj w Onesta Group</span>
      <span className={styles.welcomeLine} aria-hidden="true" />
    </p>
  );
}
