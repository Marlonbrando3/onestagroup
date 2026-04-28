import { useMemo } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  MarkerClustererF,
} from "@react-google-maps/api";

type MapLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type Props = {
  locations: MapLocation[];
};

const containerStyle = {
  width: "100%",
  height: "520px",
};

export default function LocationsMap({ locations }: Props) {
  const center = useMemo(() => {
    if (!locations.length) return { lat: 37.9838, lng: -0.6794 };
    const lat = locations.reduce((sum, l) => sum + l.lat, 0) / locations.length;
    const lng = locations.reduce((sum, l) => sum + l.lng, 0) / locations.length;
    return { lat, lng };
  }, [locations]);

  const clusterRenderer = {
    render: ({
      count,
      position,
    }: {
      count: number;
      position: google.maps.LatLng;
    }) => {
      // Bigger + custom color clusters (no external PNG files needed)
      const size = count < 10 ? 52 : count < 50 ? 64 : 78;
      const color = count < 10 ? "#16a34a" : count < 50 ? "#15803d" : "#166534";

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="${color}" />
          <circle cx="50" cy="50" r="34" fill="rgba(255,255,255,0.18)" />
        </svg>
      `;

      return new google.maps.Marker({
        position,
        icon: {
          url: `data:image/svg+xml;base64,${btoa(svg)}`,
          scaledSize: new google.maps.Size(size, size),
        },
        label: {
          text: String(count),
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: "700",
        },
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      });
    },
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={9}
        options={{
          zoomControl: true, // + / - buttons
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        <MarkerClustererF
          options={{
            renderer: clusterRenderer,
            minimumClusterSize: 2,
          }}
        >
          {(clusterer) => (
            <>
              {locations.map((loc) => (
                <MarkerF
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  title={loc.name}
                  clusterer={clusterer}
                />
              ))}
            </>
          )}
        </MarkerClustererF>
      </GoogleMap>
    </LoadScript>
  );
}
