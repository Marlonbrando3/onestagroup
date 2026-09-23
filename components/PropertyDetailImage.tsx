import Image from "next/image";
import { useState } from "react";
import {
  optimizedPropertyImageUrl,
  propertyImageUrl,
} from "@/lib/propertyImages";

// Reuse the existing allow-listed image proxy and optimizer used by listing cards.
// The direct source remains a fallback if an external feed cannot be optimized.
export default function PropertyDetailImage({
  image,
  alt,
  main = false,
  onClick,
}: {
  image: unknown;
  alt: string;
  main?: boolean;
  onClick?: () => void;
}) {
  const [direct, setDirect] = useState(false);
  const sizes = main
    ? "(min-width: 1024px) 780px, (min-width: 768px) 60vw, 95vw"
    : "(min-width: 1024px) 170px, (min-width: 768px) 121px, 15vw";
  const className = "absolute inset-0 h-full w-full rounded-md object-cover";
  if (direct)
    return (
      <img
        src={propertyImageUrl(image)}
        alt={alt}
        className={className}
        onClick={onClick}
        loading={main ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={main ? "high" : undefined}
      />
    );
  return (
    <Image
      src={optimizedPropertyImageUrl(image)}
      alt={alt}
      fill
      sizes={sizes}
      quality={70}
      priority={main}
      fetchPriority={main ? "high" : undefined}
      className={className}
      onClick={onClick}
      onError={() => setDirect(true)}
    />
  );
}
