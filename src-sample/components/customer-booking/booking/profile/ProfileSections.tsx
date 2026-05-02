"use client";

import React from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { ShowIf } from "@/lib/utilities/showIf";
import { Carousel } from "@/components/ui/carousel";
import MapBoxRadiusReadOnly from "@/components/features/mapboxmap-read-only";

import {
  Freelancer,
  PortfolioItem,
  ServiceArea,
  ServiceCategory,
  ServiceOption,
  FreelancerService,
} from "@/types/api/freelancer.types";

interface ProfileSectionsProps {
  freelancer: Freelancer;
  categoryList: ServiceCategory[];
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  filteredServices: FreelancerService[];
  onSelectService: (payload: {
    serviceId: number;
    optionId: number | null;
  }) => void;
  hasPhotos: boolean;
  photos: PortfolioItem[];
  onPhotoClick: (index: number) => void;
  hasBio: boolean;
  showFullBio: boolean;
  setShowFullBio: (show: boolean) => void;
  primaryServiceArea: ServiceArea | null;
  servicesRef: React.RefObject<HTMLDivElement | null>;
  photosRef: React.RefObject<HTMLDivElement | null>;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  locationRef: React.RefObject<HTMLDivElement | null>;
  firstName: string;
}

const ProfileSections: React.FC<ProfileSectionsProps> = ({
  freelancer,
  categoryList,
  activeCategoryId,
  setActiveCategoryId,
  filteredServices,
  onSelectService,
  hasPhotos,
  photos,
  onPhotoClick,
  hasBio,
  showFullBio,
  setShowFullBio,
  primaryServiceArea,
  servicesRef,
  photosRef,
  aboutRef,
  locationRef,
  firstName,
}) => {
  return (
    <div className="px-5">
      {/* SERVICES SECTION */}
      <section ref={servicesRef} className="scroll-mt-20">
        {categoryList.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-3 pt-4">
            {categoryList.map((cat: ServiceCategory) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "white" : "glass"}
                  size="sm"
                  borderRadius="rounded-[10px]"
                  shadow={
                    isActive
                      ? undefined
                      : "shadow-[inset_0_4px_4px_0_rgba(210,210,210,0.25)]"
                  }
                  blur={isActive ? undefined : "backdrop-blur-[94px]"}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className="h-[34px] leading-none whitespace-nowrap font-medium"
                >
                  {cat.name}
                </Button>
              );
            })}
          </div>
        )}

        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
          {filteredServices.map((service: FreelancerService) => {
            const options = service.options || [];
            const minPrice =
              options.length > 0
                ? Math.min(...options.map((o: ServiceOption) => o.price))
                : null;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() =>
                  onSelectService({
                    serviceId: service.id,
                    optionId: options[0]?.id ?? null,
                  })
                }
                className="rounded-[16px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_100%)] shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)] backdrop-blur-[82px] w-full py-5 px-4 cursor-pointer"
              >
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <h4 className="text-xs capitalize mb-1 text-start font-medium">
                      {service.name}
                    </h4>
                    {service.category?.name && (
                      <p className="text-[11px] text-white/80 capitalize text-start font-normal">
                        {service.category.name}
                      </p>
                    )}
                  </div>
                  {minPrice !== null && (
                    <div className="text-xs flex gap-1 font-normal items-center">
                      from £{minPrice.toFixed(2)}
                      <ChevronRight className="h-4" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {filteredServices.length === 0 && (
            <p className="text-[12px] text-purple-300">
              No services found for this category.
            </p>
          )}
        </div>
      </section>
      <hr className="border-bg-white/40 mt-8" />

      {/* PHOTOS */}
      <ShowIf condition={!!hasPhotos}>
        <section ref={photosRef} className="mt-2 pt-8 scroll-mt-20">
          <h2 className="text-[22px] text-center font-bold mb-4 text-white/40">
            Photos
          </h2>
          <Carousel>
            {(() => {
              const chunks = [];
              for (let i = 0; i < photos.length; i += 9) {
                chunks.push(photos.slice(i, i + 9));
              }
              return chunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex} className="grid grid-cols-3 gap-3">
                  {chunk.map((item: PortfolioItem, itemIndex: number) => {
                    const globalIndex = chunkIndex * 9 + itemIndex;
                    return (
                      <div
                        key={item.id}
                        className="relative w-[110px] h-[145px] pb-[100%] cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => onPhotoClick(globalIndex)}
                      >
                        <img
                          src={item.image_url}
                          alt={item.caption || "photo"}
                          className="absolute inset-0 w-[105px] h-[145px] object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </Carousel>
        </section>
      </ShowIf>
      <hr className="border-bg-white/40 mt-8" />

      {/* ABOUT */}
      <ShowIf condition={!!hasBio}>
        <section ref={aboutRef} className="mt-2 pt-8 scroll-mt-20">
          <h2 className="text-[22px] text-center font-bold mb-4 text-white/40">
            About {firstName}
          </h2>

          {(() => {
            const bio = freelancer?.additional_info?.bio?.trim();
            const text = bio || "Bio Unavailable";
            const shortText = text.slice(0, 160);

            return (
              <p className="text-[11px] text-white leading-relaxed">
                {!showFullBio ? shortText : text}
                {text.length > 160 && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-[12px] text-white ml-1 font-medium"
                  >
                    {showFullBio ? " Show less" : " Read more..."}
                  </button>
                )}
              </p>
            );
          })()}
        </section>
      </ShowIf>
      <hr className="border-bg-white/40 mt-8" />

      {/* LOCATION */}
      <section ref={locationRef} className="mt-2 pt-8 scroll-mt-20">
        <h2 className="text-[22px] text-center font-bold mb-3 text-white/40">
          Location
        </h2>
        <p className="text-sm text-center text-white mb-4">
          This artist can travel within the purple area
        </p>

        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
          {primaryServiceArea ? (
            <MapBoxRadiusReadOnly
              longitude={parseFloat(String(primaryServiceArea.longitude))}
              latitude={parseFloat(String(primaryServiceArea.latitude))}
              radiusInKm={
                primaryServiceArea.radius
                  ? parseInt(
                      String(primaryServiceArea.radius).replace("km", ""),
                    )
                  : 5
              }
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-400">
              Map not available
            </div>
          )}
        </div>
      </section>
      <hr className="border-bg-white/40 mt-8" />
    </div>
  );
};

export default ProfileSections;
