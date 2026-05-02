
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useEditProfileForm } from "./hook/editProfile.hook";
import BasicInformation from "./BasicInformation";
import AccountDetails from "./AccountDetails";
// import ProfessionalProfile from "./ProfessionalProfile";
import ChargingRates from "./ChargingRates";
import PortfolioImages from "./photos/Photos";
import AvailabilityForm from "./availabilty/AvailabilityForm";
import FreelancerServices from "./services/FreelancerServices";
import MapBoxRadiusSelector from "@/components/features/mapboxmap";
import ContactDetails from "./ContactDetails";
import Button from "@/components/ui/button/Button";
import { Loader2 } from "lucide-react";
import freelancersService from "@/api/services/freelancersService";
import { ToastService } from "@/utils/toastService";
import { useGetFreelancerDetailsById } from "@/hooks/queries/freelancers/useGetFreelancersDetailsById";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import { HEADER_CONFIG } from "@/config/headerName";
import PageBreadcrumbButton from "@/components/common/PageBreadCrumbButton";
import { FilterTabs } from "../../freelancerDetails/FreelancerFilterTabs";
import { useGetFreelancerReferrals } from "@/hooks/queries/freelancers/useGetFreelancerReferrals";
import { useNavigate, useParams } from "react-router-dom";

type FormStep =
  | "basic"
  | "contact"
  | "rates"
  | "portfolio"
  | "availability"
  | "services"
  | "travel_zone";

const FORM_STEPS: { id: FormStep; label: string }[] = [
  { id: "basic", label: "Profile Information" },
  { id: "contact", label: "Contact Details" },
  { id: "rates", label: "Charging Rates" },
  { id: "portfolio", label: "Portfolio" },
  { id: "availability", label: "Availability" },
  { id: "services", label: "Services" },
  { id: "travel_zone", label: "Travel Zone" },
];

const ConsolidatedEditProfileForm = () => {
  const [activeStep, setActiveStep] = useState<FormStep>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();

  const { data: freelancerDetailsData, isLoading: isLoadingDetails } =
    useGetFreelancerDetailsById(id!, { enabled: !!id });
  const { data: freelancerReferralsData } = useGetFreelancerReferrals(id || "");
  const referralsCount = freelancerReferralsData?.data?.data?.length || 0;
  const freelancer = freelancerDetailsData?.data?.data;

  const formMethods = useEditProfileForm({}, undefined, activeStep);
  const { reset, handleSubmit } = formMethods;
  const navigate = useNavigate();

  // Transform API data to Form data
  useEffect(() => {
    if (freelancer) {
      // Map Availability
      const availabilityMap: any = {
        monday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        tuesday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        wednesday: {
          enabled: false,
          slots: [{ start: "09:00", end: "13:00" }],
        },
        thursday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        friday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        saturday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
        sunday: { enabled: false, slots: [{ start: "09:00", end: "13:00" }] },
      };

      if (freelancer.availability) {
        const dayMapIntToString: { [key: number]: string } = {
          1: "monday",
          2: "tuesday",
          3: "wednesday",
          4: "thursday",
          5: "friday",
          6: "saturday",
          7: "sunday",
        };

        freelancer.availability.forEach((dayData: any) => {
          // Use day_of_week from API if available, fallback to day string if legacy
          const dayName = dayData.day_of_week
            ? dayMapIntToString[dayData.day_of_week]
            : dayData.day?.toLowerCase();

          if (dayName && availabilityMap[dayName]) {
            availabilityMap[dayName] = {
              enabled: dayData.is_enabled,
              slots: dayData.slots.map((slot: any) => ({
                start: slot.start_time.substring(0, 5),
                end: slot.end_time.substring(0, 5),
              })),
            };
          }
        });
      }

      // Map portfolio items (thumbnail -> thumbnail_url mismatch fix)
      const mappedPortfolio =
        freelancer.portfolio?.map((item: any) => ({
          ...item,
          db_id: item.id, // Store database ID separately from fieldArray id
          thumbnail_url: item.thumbnail || item.thumbnail_url,
          caption: item.caption || item.image_caption || "", 
        })) || [];

      // Map catalogue_services to services with proper structure
      const mappedServices =
        freelancer.catalogue_services?.map((service: any) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          status: service.status,
          order_index: service.order_index,
          serviceCategory: service.category,
          options: service.options,
        })) || [];

      reset({
        firstName: freelancer.first_name || "",
        lastName: freelancer.last_name || "",
        userName: freelancer.username || "",
        email: freelancer.email || "",
        phone: (freelancer.country_code || "") + (freelancer.phone || ""),
        phoneData: {
          fullPhone: (freelancer.country_code || "") + (freelancer.phone || ""),
          countryCode: freelancer.country_code || "",
          phoneNumber: freelancer.phone || "",
        },
        freelancerBio: freelancer.bio || "",
        instagramHandle: freelancer.onboarding?.instagram_handle || "",
        freelancerPortfolioImages: mappedPortfolio,
        freelancerPostalCode: freelancer.service_places?.[0]?.postcode || "",
        availability: availabilityMap,
        calendars: freelancer.calendars || [], // Assuming calendars might be in root or elsewhere, keeping as is if not in example
        // Contact Details Mapping
        isWhatsAppEnabled:
          freelancer.contacts?.whats_app_number_enabled || false,
        whatsapp: freelancer.contacts?.whats_app_number || "",
        isEmailEnabled: freelancer.contacts?.email_enabled || false,
        additional_email: freelancer.contacts?.profile_email || "", // Mapped to profile_email based on user JSON "profile_email": null
        isTextEnabled: freelancer.contacts?.sms_number_enabled || false,
        text: freelancer.contacts?.sms_number || "",
        isEmailVerified: false,
        services: mappedServices,
        service_categories:
          freelancer.service_categories_list ||
          freelancer.service_categories?.map((c: any) => c.slug) ||
          [],
        category_rates:
          freelancer.category_rates || freelancer.onboarding?.category_rates || {},
        serviceRadius: parseInt(
          freelancer.service_places?.[0]?.radius?.replace("km", "") || "5"
        ),
        serviceLocation: {
          longitude: parseFloat(
            freelancer.service_places?.[0]?.longitude || "-0.1276"
          ),
          latitude: parseFloat(
            freelancer.service_places?.[0]?.latitude || "51.5074"
          ),
        },
        // localTravelFee: freelancer.service_places?.[0]?.local_travel_fee || "",
      });
    }
  }, [freelancer, reset]);

  useEffect(() => {
    if (formMethods?.formState?.errors) {
      console.log("hi", formMethods?.formState?.errors);
    }
  }, [formMethods?.formState?.errors]);

  const handleFormSubmit = async (data: any) => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      // Transform availability for payload
      const availabilityPayload = Object.entries(data.availability).map(
        ([day, value]: [string, any]) => {
          const dayMap: Record<string, number> = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7,
          };
          return {
            day_of_week: dayMap[day],
            is_enabled: value.enabled,
            slots: value.enabled
              ? value.slots.map((slot: any) => ({
                  start_time: `${slot.start}:00`,
                  end_time: `${slot.end}:00`,
                }))
              : [],
          };
        }
      );

      // Helper to remove empty fields
      const removeEmptyFields = (obj: any) => {
        return Object.entries(obj).reduce((acc: any, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            // Keep filtering shallow for now as per previous behavior,
            // but ensure 0 is kept (value !== "" covers this as 0 !== "").
            acc[key] = value;
          }
          return acc;
        }, {});
      };

      const freelancerAddress = {
        postcode: data.freelancerPostalCode,
        address: data.freelancer_Address || "",
      };

      const placesPayload = data.freelancerPostalCode
        ? [
            {
              service_place_id: 1,
              postcode: freelancerAddress.postcode,
              address: freelancerAddress.address,
              latitude: data.serviceLocation?.latitude?.toString() || "",
              longitude: data.serviceLocation?.longitude?.toString() || "",
              radius: data.serviceRadius?.toString() || "0",
              local_travel_fee: data.localTravelFee?.toString() || "0",
            },
          ]
        : undefined;

      console.log("Form data freelancerPortfolioImages:", data.freelancerPortfolioImages);

      const portfolioPayload = data.freelancerPortfolioImages?.map((img: any, index: number) => ({
        id: img.db_id || (typeof img.id === 'number' ? img.id : undefined), // Only send numeric IDs as db IDs, ignore fieldArray UUIDs
        image_url: img.image_url,
        thumbnail_url: img.thumbnail_url,
        caption: img.caption || img.image_caption || "",
        order_id: index + 1
      }));

      console.log("Generated portfolio payload:", portfolioPayload);

      // 1. Update Freelancer Details (including Availability)
      const rawPayload = {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.userName,
        email: data.email,
        phone: data.phoneData?.phoneNumber,
        country_code: data.phoneData?.countryCode,
        bio: data.freelancerBio,
        instagram_handle: data.instagramHandle,
        places: placesPayload,
        availability: availabilityPayload,
        // Contact Details Payload
        whats_app_number: data.whatsapp,
        whats_app_number_enabled: data.isWhatsAppEnabled,
        additional_email: data.additional_email,
        sms_number: data.text,
        sms_number_enabled: data.isTextEnabled,
        password: data.password,
        portfolio: portfolioPayload,
        service_categories: data.service_categories, // New field
        category_rates: Object.keys(data.category_rates || {})
        .filter((key) => data.service_categories?.includes(key))
        .reduce((obj: any, key) => {
          const rateData = data.category_rates[key];
          if (key.toLowerCase().includes("nail")) {
            obj[key] = {
              ...rateData,
              full_day: 0
            };
          } else {
            obj[key] = rateData;
          }
          return obj;
        }, {}), // Filtered category rates based on selected categories
        services: data.services?.map((s: any, index: number) => {
          // Clean options - only keep allowed fields
          const cleanOptions = (s.options || []).map((opt: any) => ({
            ...(opt.id ? { id: String(opt.id) } : {}),
            product_name: opt.product_name || opt.name,
            duration: opt.duration,
            price: opt.price,
            discount: opt.discount,
          }));

          return {
            ...(s.id ? { id: String(s.id) } : {}),
            service_category_id: s.service_category_id || s.category?.id,
            name: s.name,
            description: s.description,
            status: s.status,
            order_index: index + 1,
            options: cleanOptions,
          };
        }),
      };

      const payload = removeEmptyFields(rawPayload);

      console.log("Final rawPayload to be sent:", rawPayload);
      console.log("Final payload (after removeEmptyFields):", payload);
      const response = await freelancersService.updateFreelancerById(
        id,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        ToastService.success("Profile updated successfully");
      } else {
        ToastService.error(
          response?.data?.message || "Failed to update profile"
        );
      }
    } catch (error) {
      console.error(error);
      ToastService.error("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Edit Freelancer Profile | ${HEADER_CONFIG.NAME}`}
        description="Edit Freelancer Profile"
      />

      <PageBreadcrumbButton
        pageTitle="Edit Freelancer Profile"
        destination_name="Freelancer Bookings"
        destination_path="freelancers"
        is_reverse={true}
      />

      <ComponentCard
        footerContent={
          <FilterTabs
            activeTab="edit_profile"
            onChange={(tab) => {
              if (tab === "booking") {
                navigate(`/freelancers/booking-details/${id}`);
              } else if (tab === "profile") {
                navigate(`/freelancers/${id}`);
              } else if (tab === "referral_details") {
                navigate(`/freelancers/referral-details/${id}`);
              }
            }}
            referralCount={referralsCount}
          />
        }
      >
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Form Step Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 dark:bg-black/40 rounded-lg border border-gray-200 dark:border-gray-800">
              {FORM_STEPS.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeStep === step.id
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            <div className="min-h-[400px]">
              {activeStep === "basic" && (
                <ComponentCard title="Profile Information">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Basic Information
                      </h3>
                      <BasicInformation />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Account Details
                      </h3>
                      <AccountDetails />
                    </div>
                    {/* <div>
                      <h3 className="text-lg font-medium mb-4">
                        Professional Profile
                      </h3>
                      <ProfessionalProfile />
                    </div> */}
                  </div>
                </ComponentCard>
              )}

              {activeStep === "contact" && (
                <ComponentCard title="Contact Details">
                  <ContactDetails />
                </ComponentCard>
              )}

              {activeStep === "rates" && (
                <ComponentCard title="Charging Rates">
                  <ChargingRates />
                </ComponentCard>
              )}

              {activeStep === "portfolio" && (
                <ComponentCard title="Portfolio">
                  <PortfolioImages onSave={() => handleSubmit(handleFormSubmit)()} />
                </ComponentCard>
              )}

              {activeStep === "availability" && (
                <ComponentCard title="Availability">
                  <AvailabilityForm />
                </ComponentCard>
              )}

              {activeStep === "services" && (
                <ComponentCard title="Services">
                  <FreelancerServices 
                    serviceCategories={freelancer?.service_categories || []}
                    initialServices={freelancer?.catalogue_services || []}
                  />
                </ComponentCard>
              )}

              {activeStep === "travel_zone" && (
                <ComponentCard title="Travel Zone">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 text-center">
                      <p className="text-lg font-medium">
                        How far are you willing to travel?
                      </p>
                      <MapBoxRadiusSelector
                        formMethods={formMethods}
                        initialRadius={formMethods.getValues("serviceRadius")}
                        initialCenter={[
                          formMethods.getValues("serviceLocation.longitude"),
                          formMethods.getValues("serviceLocation.latitude"),
                        ]}
                      />
                    </div>

                    {/* <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                      <div>
                        <h3 className="text-lg font-medium">Local Travel Fee</h3>
                        <p className="text-gray-500 text-sm">
                          Set a fee that will be added on top of your service
                          fee for travel bookings.
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 font-medium">£</span>
                        <input
                          type="text"
                          {...formMethods.register("localTravelFee")}
                          className="w-40 px-3 py-2 bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                          placeholder="e.g. 10"
                        />
                        <span className="text-gray-500 text-sm">
                          Avg. £5-20
                        </span>
                      </div>
                    </div> */}
                  </div>
                </ComponentCard>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="w-40">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </ComponentCard>
    </>
  );
};

export default ConsolidatedEditProfileForm;
