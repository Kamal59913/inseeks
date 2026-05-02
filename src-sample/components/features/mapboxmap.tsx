"use client";
import React, { useRef, useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Map, {
  FullscreenControl,
  NavigationControl,
  Source,
  Layer,
  MapRef,
} from "react-map-gl";
import axios from "axios";

// Configuration for radius slider sensitivity
// Decrease RADIUS_STEP to make the slider less sensitive (finer control)
// Increase MAX_RADIUS to allow larger range
const RADIUS_STEP = 0.1;
const MAX_RADIUS = 100;
const MIN_RADIUS = 5;

interface MapBoxRadiusSelectorProps {
  initialCenter?: [number, number];
  initialRadius?: number;
  formMethods: any;
  autoFocus?: boolean;
  scrollZoom?: boolean;
  controlType?: "slider" | "buttons"; // New prop to choose control type
}

const MapBoxRadiusSelector: React.FC<MapBoxRadiusSelectorProps> = ({
  initialCenter = [-0.1276, 51.5074],
  initialRadius = 5,
  formMethods,
  autoFocus = true,
  scrollZoom = false,
  controlType = "buttons", // Default to slider for backwards compatibility
}) => {
  const mapRef = useRef<MapRef>(null);
  const [radius, setRadius] = useState(initialRadius);
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPressingRef = useRef(false);

  // Calculate appropriate zoom level based on radius for mobile view (353px width)
const getZoomForRadius = (radiusInKm: number) => {
    if (radiusInKm <= 7) return 10;
    if (radiusInKm <= 13) return 9;
    if (radiusInKm <= 19) return 8.5;
    if (radiusInKm <= 27) return 8;
    if (radiusInKm <= 56) return 7;
    return 6;
  };
  // Get the geocoding coordinates from postal code or address
  const geocodeAddress = async (address: string) => {
    const mapboxApiKey = process.env.NEXT_PUBLIC_PUBLIC_TOKEN;
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address,
        )}.json`,
        {
          params: {
            access_token: mapboxApiKey,
            country: "GB",
            limit: 1,
          },
        },
      );

      const features = response.data.features || [];
      if (features.length > 0) {
        const [lng, lat] = features[0].center;
        return [lng, lat] as [number, number];
      }
      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  // Watch for address changes - UPDATED to use freelancer fields
  const freelancerPostalCode = formMethods.watch("freelancerPostalCode");
  const isManualAddressFreelancer = formMethods.watch(
    "isManualAddressFreelancer",
  );

  // Manual address fields - kept for consistency with hint structure if needed
  const streetOne = formMethods.watch("freelancer_StreetOne");
  const streetTwo = formMethods.watch("freelancer_StreetTwo");
  const address = formMethods.watch("freelancer_Address");
  const city = formMethods.watch("freelancer_City");
  const state = formMethods.watch("freelancer_State");
  const serviceRadius = formMethods.watch("serviceRadius");

  // Sync local radius state with form value (e.g. when loaded from API)
  useEffect(() => {
    if (serviceRadius !== undefined && serviceRadius !== null) {
      const parsedRadius = parseFloat(serviceRadius);
      setRadius(parsedRadius);
    }
  }, [serviceRadius]);

  useEffect(() => {
    const updateMapCenter = async () => {
      setIsLoadingLocation(true);

      let newCenter: [number, number] | null = null;

      // Priority 1: Use freelancerPostalCode if it exists
      if (freelancerPostalCode && !isManualAddressFreelancer) {
        newCenter = await geocodeAddress(freelancerPostalCode);
      }
      // Priority 2: Use manual address fields if manual entry is enabled
      else if (isManualAddressFreelancer) {
        const addressParts = [
          streetOne,
          streetTwo,
          address,
          freelancerPostalCode,
          city,
          state,
        ].filter(Boolean);

        if (addressParts.length > 0) {
          const fullAddress = addressParts.join(", ");
          newCenter = await geocodeAddress(fullAddress);
        }
      }

      if (newCenter) {
        setCenter(newCenter);

        // Update the map view with appropriate zoom for current radius
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: newCenter,
            zoom: getZoomForRadius(radius),
            duration: 1000,
          });
        }

        // Store the center coordinates in form
        formMethods.setValue(
          "serviceLocation",
          {
            longitude: newCenter[0],
            latitude: newCenter[1],
          },
          { shouldValidate: true },
        );
      }

      setIsLoadingLocation(false);
    };

    updateMapCenter();
  }, [
    freelancerPostalCode,
    isManualAddressFreelancer,
    streetOne,
    streetTwo,
    address,
    city,
    state,
  ]);

  // Update map zoom when radius changes to keep circle visible
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        center: center,
        zoom: getZoomForRadius(radius),
        duration: 500,
      });
    }
  }, [radius, center]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  const circleData = createCircle(center, radius);

  const handleMapLoad = () => {
    if (mapRef.current) {
      mapRef.current.resize();
      mapRef.current.easeTo({
        center: center,
        zoom: getZoomForRadius(radius),
        duration: 200,
      });
    }
  };

  const startContinuousChange = (direction: "increase" | "decrease") => {
    if (isPressingRef.current) return;
    isPressingRef.current = true;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start continuous change
    intervalRef.current = setInterval(() => {
      setRadius((prevRadius) => {
        const currentValue = parseFloat(String(prevRadius));
        let newRadius;

        if (direction === "increase") {
          newRadius = Math.min(MAX_RADIUS, currentValue + RADIUS_STEP);
        } else {
          newRadius = Math.max(MIN_RADIUS, currentValue - RADIUS_STEP);
        }

        // Update form value
        formMethods.setValue("serviceRadius", newRadius, {
          shouldValidate: true,
        });

        return newRadius;
      });
    }, 50); // Update every 50ms for smooth animation
  };

  const stopContinuousChange = () => {
    isPressingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 text-center">
        <p className="text-gray-400 text-sm">
          Set a radius around your location where you'll accept booking
          requests.
        </p>
        <p className="text-gray-400 text-sm">
          You can still choose to accept or decline each booking after seeing
          the address.
        </p>
      </div>

      {isLoadingLocation && (
        <div className="text-center text-gray-400 text-sm mb-2">
          Loading location...
        </div>
      )}

      {controlType === "slider" && (
        <div className="relative flex flex-col items-center justify-center mb-8 gap-3">
          <Controller
            name="serviceRadius"
            control={formMethods.control}
            render={({ field }) => (
              <input
                type="range"
                min={MIN_RADIUS}
                max={MAX_RADIUS}
                step={RADIUS_STEP}
                value={field.value || initialRadius}
                onChange={(e) => {
                  const newRadius = parseFloat(e.target.value);
                  setRadius(newRadius);
                  field.onChange(newRadius);
                }}
                className="w-60 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            )}
          />
        </div>
      )}

      <div className="flex items-center justify-center">
        <div
          className="rounded-2xl overflow-hidden relative shadow-lg"
          style={{ width: "329px", height: "345px" }}
        >
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_PUBLIC_TOKEN!}
            initialViewState={{
              longitude: center[0],
              latitude: center[1],
              zoom: getZoomForRadius(initialRadius),
            }}
            onLoad={handleMapLoad}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            scrollZoom={scrollZoom}
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

          {/* Plus/Minus buttons - shown when controlType is "buttons" */}
          {controlType === "buttons" && (
            <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
              <Controller
                name="serviceRadius"
                control={formMethods.control}
                render={({ field }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const currentValue = parseFloat(
                          field.value || initialRadius,
                        );
                        const newRadius = Math.min(
                          MAX_RADIUS,
                          currentValue + RADIUS_STEP,
                        );
                        setRadius(newRadius);
                        field.onChange(newRadius);
                      }}
                      onMouseDown={() => startContinuousChange("increase")}
                      onMouseUp={stopContinuousChange}
                      onMouseLeave={stopContinuousChange}
                      onTouchStart={() => startContinuousChange("increase")}
                      onTouchEnd={stopContinuousChange}
                      className="w-8 h-8 bg-white rounded-md shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center text-gray-700 font-bold text-lg select-none"
                      aria-label="Increase radius"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentValue = parseFloat(
                          field.value || initialRadius,
                        );
                        const newRadius = Math.max(
                          MIN_RADIUS,
                          currentValue - RADIUS_STEP,
                        );
                        setRadius(newRadius);
                        field.onChange(newRadius);
                      }}
                      onMouseDown={() => startContinuousChange("decrease")}
                      onMouseUp={stopContinuousChange}
                      onMouseLeave={stopContinuousChange}
                      onTouchStart={() => startContinuousChange("decrease")}
                      onTouchEnd={stopContinuousChange}
                      className="w-8 h-8 bg-white rounded-md shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center text-gray-700 font-bold text-lg select-none"
                      aria-label="Decrease radius"
                    >
                      −
                    </button>
                  </>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapBoxRadiusSelector;

