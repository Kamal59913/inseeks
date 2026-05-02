"use client";
import React, { useRef } from "react";
import Map, {
  FullscreenControl,
  NavigationControl,
  Source,
  Layer,
  MapRef,
} from "react-map-gl";

interface MapBoxRadiusReadOnlyProps {
  longitude: number;
  latitude: number;
  radiusInKm: number;
}

const MapBoxRadiusReadOnly: React.FC<MapBoxRadiusReadOnlyProps> = ({
  longitude,
  latitude,
  radiusInKm,
}) => {
  const mapRef = useRef<MapRef>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const createCircle = (center: [number, number], radiusInKm: number) => {
    const points = 64;
    const km = radiusInKm;
    const coords = {
      latitude: center[1],
      longitude: center[0],
    };

    const ret = [];
    const distanceX =
      km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "Polygon" as const,
        coordinates: [ret],
      },
    };
  };

  // Calculate appropriate zoom level based on radius for mobile view (353px width)
  const getZoomForRadius = (radiusInKm: number) => {
    if (radiusInKm <= 5) return 10;
    if (radiusInKm <= 10) return 9.5;
    if (radiusInKm <= 20) return 9;
    if (radiusInKm <= 35) return 8;
    return 7;
  };

  const circleData = createCircle([longitude, latitude], radiusInKm);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#1f1f28]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1f1f28] z-10">
          <svg
            className="animate-spin text-white/50"
            style={{ width: "2rem", height: "2rem" }}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray="31.4 31.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_PUBLIC_TOKEN!}
        initialViewState={{
          longitude: longitude,
          latitude: latitude,
          zoom: getZoomForRadius(radiusInKm),
        }}
        onLoad={() => setIsLoading(false)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        scrollZoom={false}
      >
        <NavigationControl position="bottom-right" />
        <FullscreenControl position="top-right" />

        <Source id="radius-circle" type="geojson" data={circleData}>
          <Layer
            id="circle-fill"
            type="fill"
            paint={{
              "fill-color": "#8B5CF6",
              "fill-opacity": 0.2,
            }}
          />
          <Layer
            id="circle-outline"
            type="line"
            paint={{
              "line-color": "#8B5CF6",
              "line-width": 2,
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default MapBoxRadiusReadOnly;

