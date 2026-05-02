"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetFreelancerByUserName } from "@/hooks/freelancerServices/useGetFreeLancerServices";
import Loader from "@/components/ui/loader/loader";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileHero from "./profile/ProfileHero";
import ProfileInfo from "./profile/ProfileInfo";
import ProfileTabs from "./profile/ProfileTabs";
import ProfileSections from "./profile/ProfileSections";
import ProfileFooter from "./profile/ProfileFooter";
import BookingModal from "./BookingModal";
import { useRouter } from "next/navigation";
import SelectContactMode from "@/components/features/SelectContactMode";
import {
  handleInstagramOpen,
  handleWhatsappOpen,
  LinkOpener,
} from "@/lib/utilities/socialLinks";
import PhotoGalleryModal from "../PhotoGallaryModal";
import { getFullWebLink } from "@/lib/utilities/profileUtils";
import Button from "@/components/ui/button/Button";

import {
  Freelancer,
  FreelancerService,
  ServiceCategory,
} from "@/types/api/freelancer.types";

export default function FreelancerProfilePage({}: {}) {
  const { username } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetFreelancerByUserName(
    username as string,
  );

  const [activeTab, setActiveTab] = useState("SERVICES");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Refs
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const photosRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const locationRef = useRef<HTMLDivElement | null>(null);

  // State
  const [selected, setSelected] = useState<Freelancer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    serviceId: number | null;
    optionId: number | null;
  }>({ serviceId: null, optionId: null });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Photo modal state
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Read-more bio
  const [showFullBio, setShowFullBio] = useState(false);

  // Scroll Progress
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const totalScroll = scrollHeight - clientHeight;
      const currentProgress =
        totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);
    }
  };

  const freelancer: Freelancer | undefined = data?.data?.data;

  useEffect(() => {
    if (freelancer) {
      setSelected(freelancer);
      const services = freelancer.services || [];
      const categoryList: ServiceCategory[] = Array.from(
        new Map(
          services
            .filter((s: FreelancerService) => s.category?.id)
            .map((s: FreelancerService) => [s.category.id, s.category]),
        ).values(),
      );

      if (categoryList.length > 0 && activeCategoryId === null) {
        setActiveCategoryId(categoryList[0].id);
      }
    }
  }, [freelancer, activeCategoryId]);

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state - User not found
  if (isError || !freelancer) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#2b0626] via-[#180017] to-[#120012] text-white">
        <div className="text-center px-6">
          <h1 className="text-xl font-semibold mb-3">Freelancer Not Found</h1>
          <p className="text-gray-400 mb-6">
            {(error as any)?.message ||
              "The freelancer profile you're looking for doesn't exist or has been removed."}
          </p>
          <Button
            size="rg"
            variant="white"
            borderRadius="rounded-xl"
            onClick={() => router.back()}
            className="px-6 py-3 font-medium transition-colors"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const profilePic = freelancer.primary_image || "/default_profile.svg";
  const fullName = `${freelancer.first_name} ${freelancer.last_name}`;
  const firstName = `${freelancer.first_name}`;
  const hasBio = Boolean(freelancer?.additional_info?.bio?.trim());

  const services = freelancer.services || [];
  const photos = freelancer.portfolio || [];
  const hasPhotos = freelancer?.portfolio?.length > 0;
  const primaryServiceArea = freelancer.service_areas?.[0] || null;

  const locationText = `Travel from`;
  const locationTextAddress =
    primaryServiceArea?.postcode?.split(",")[0]?.trim() ||
    `${primaryServiceArea?.address?.split(",").pop()?.trim().slice(0, 3)}` ||
    "";

  const TAB_LIST = ["SERVICES", "PHOTOS", "ABOUT", "LOCATION"];

  const categoryList: ServiceCategory[] = Array.from(
    new Map(
      (services || [])
        .filter((s: FreelancerService) => s.category?.id)
        .map((s: FreelancerService) => [s.category.id, s.category]),
    ).values(),
  );

  const filteredServices =
    activeCategoryId == null
      ? services
      : services.filter(
          (s: FreelancerService) => s.category?.id === activeCategoryId,
        );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    setTimeout(() => {
      let targetRef: React.RefObject<HTMLDivElement | null> | undefined;

      switch (tab) {
        case "SERVICES":
          targetRef = servicesRef;
          break;
        case "PHOTOS":
          targetRef = photosRef;
          break;
        case "ABOUT":
          targetRef = aboutRef;
          break;
        case "LOCATION":
          targetRef = locationRef;
          break;
      }

      if (targetRef && targetRef.current) {
        targetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  function handleSelectServiceForBooking(payload: {
    serviceId: number;
    optionId: number | null;
  }) {
    setSelectedService({
      serviceId: payload.serviceId,
      optionId: payload.optionId ?? null,
    });
    setModalOpen(true);
  }

  function closeBookingModal() {
    setModalOpen(false);
    setSelectedService({ serviceId: null, optionId: null });
  }

  return (
    <>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-screen overflow-auto bg-gradient-to-b from-[#2b0626] via-[#180017] to-[#120012] text-white"
      >
        <ProfileHeader
          scrollProgress={scrollProgress}
          router={router}
          LinkOpener={LinkOpener}
          getFullWebLink={getFullWebLink}
        />

        <ProfileHero
          profilePic={profilePic}
          fullName={fullName}
          categoryList={categoryList}
          hasPhotos={hasPhotos}
          onPhotoClick={() => {
            if (hasPhotos) {
              setSelectedPhotoIndex(0);
              setPhotoModalOpen(true);
            }
          }}
        />

        <ProfileInfo
          firstName={firstName}
          locationText={locationText}
          locationTextAddress={locationTextAddress}
          freelancer={freelancer}
          showFullBio={showFullBio}
          setShowFullBio={setShowFullBio}
          setIsContactModalOpen={setIsContactModalOpen}
        />

        <ProfileTabs
          TAB_LIST={TAB_LIST}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          hasBio={hasBio}
          hasPhotos={hasPhotos}
        />

        <ProfileSections
          freelancer={freelancer}
          categoryList={categoryList}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
          filteredServices={filteredServices}
          onSelectService={handleSelectServiceForBooking}
          hasPhotos={hasPhotos}
          photos={photos}
          onPhotoClick={(index) => {
            setSelectedPhotoIndex(index);
            setPhotoModalOpen(true);
          }}
          hasBio={hasBio}
          showFullBio={showFullBio}
          setShowFullBio={setShowFullBio}
          primaryServiceArea={primaryServiceArea}
          servicesRef={servicesRef}
          photosRef={photosRef}
          aboutRef={aboutRef}
          locationRef={locationRef}
          firstName={firstName}
        />

        <div className="px-5 pb-20">
          <ProfileFooter
            handleWhatsappOpen={handleWhatsappOpen}
            handleInstagramOpen={handleInstagramOpen}
          />
        </div>
      </div>

      {modalOpen && selected && (
        <BookingModal
          selected={selected}
          closeModal={closeBookingModal}
          initialServiceId={selectedService.serviceId}
          initialOptionId={selectedService.optionId}
          freelancer={freelancer}
        />
      )}

      {photoModalOpen && (
        <PhotoGalleryModal
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setPhotoModalOpen(false)}
        />
      )}

      <SelectContactMode
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        freelancerData={freelancer}
        mode="profile"
        emptyMessage="Freelancer have not provided any Contacts"
      />
    </>
  );
}
