import Label from "@/components/ui/form/label";
import { StepComponentProps } from "./types";
import { StepWrapper } from "./utils";
import Input from "@/components/ui/form/Input";
import EmailInput from "@/components/ui/form/EmailInput";
import Button from "@/components/ui/button/Button";
import PhoneInput from "@/components/ui/form/PhoneInput";
import { countries } from "@/lib/utilities/phoneInput";
import PhotosPage from "../photos/Photos";
import TextArea from "@/components/ui/form/TextArea";
import NumberInputV2 from "@/components/ui/form/NumberInputV2";
import { handleInstagramOpen } from "@/lib/utilities/socialLinks";
import { MultiOnBoard } from "@/components/ui/dropdown/MultiOnboardController";
import { useServiceCategories } from "@/hooks/serviceCategories/useServiceCategories";
import { Controller } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import authService from "@/services/authService";
import { getCategoryConfig } from "../utils/signupUtils";

interface CategoryData {
  slug: string;
  name: string;
}

export const FirstNameStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant="lg">
        How should we call you?
      </Label>
      <Input
        register={formMethods.register}
        registerOptions="firstName"
        type="text"
        placeholder="First name"
        variant="transparent"
        errors={formMethods.formState.errors}
        maxLength={51}
        autoFocus={true}
      />
    </StepWrapper>
  );
};

export const LastNameStep: React.FC<StepComponentProps> = ({ formMethods }) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        And your last name?
      </Label>
      <Input
        register={formMethods.register}
        registerOptions="lastName"
        type="text"
        placeholder="Last name"
        variant="transparent"
        errors={formMethods.formState.errors}
        maxLength={51}
        autoFocus={true}
      />
    </StepWrapper>
  );
};

export const EmailStep: React.FC<StepComponentProps> = ({ formMethods }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<{
    type: "error" | "success" | null;
    text: string;
  }>({ type: null, text: "" });

  const email = formMethods.watch("email");

  useEffect(() => {
    const checkEmail = async () => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAvailabilityMessage({ type: null, text: "" });
        return;
      }

      setIsChecking(true);
      setAvailabilityMessage({ type: null, text: "" });

      const response = await authService.checkValue(email);

      if (response?.status === 200) {
        setAvailabilityMessage({
          type: "success",
          text: "",
        });
      } else if (response?.status === 400) {
        setAvailabilityMessage({
          type: "error",
          text: "This email is already registered. Please try another.",
        });
      } else {
        setAvailabilityMessage({
          type: "success",
          text: "",
        });
      }

      setIsChecking(false);
    };

    const debounceTimer = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounceTimer);
  }, [email]);

  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        What&apos;s your email?
      </Label>
      <EmailInput
        register={formMethods.register}
        registerOptions="email"
        type="text"
        id="emailInput"
        placeholder="name@emperabeauty.com"
        variant="transparent"
        errors={formMethods.formState.errors}
        maxLength={151}
        autoFocus={true}
      />
      {isChecking && email && (
        <p className="text-sm text-gray-400 mt-2 text-center">Checking availability...</p>
      )}

      {!isChecking && availabilityMessage.type === "error" && (
        <p className="text-sm text-red-500 mt-2 text-center">{availabilityMessage.text}</p>
      )}
    </StepWrapper>
  );
};

export const PhoneNumberStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        What&apos;s your phone number?
      </Label>
      <PhoneInput
        register={formMethods.register}
        registerOptions="phoneNumber"
        registerOptionsCountryCode="countryCode"
        id="phoneNumberInput"
        placeholder="0000 000000"
        errors={formMethods.formState.errors}
          maxLength={16}
        countries={countries}
        preValue={formMethods.getValues("phoneNumber")}
        preCountryCode={formMethods.getValues("countryCode")}
        setValue={formMethods.setValue}
        variant="transparent"
        submitType="separated"
      />
    </StepWrapper>
  );
};

export const InstagramHandleStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        What&apos;s your Instagram
      </Label>
      <Input
        register={formMethods.register}
        registerOptions="instagramHandle"
        type="text"
        placeholder="Instagram handle"
        variant="transparent"
        errors={formMethods.formState.errors}
        maxLength={51}
        autoFocus={true}
      />
    </StepWrapper>
  );
};

export const FreelancerBioStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        Tell us more about you
      </Label>
      <TextArea
        register={formMethods.register}
        registerOptions="freelancerBio"
        placeholder="Let clients know what you do best - your services, experience, and the kind of work you're known for."
        variant="transparent"
        errors={formMethods.formState.errors}
        maxLength={1001}
        autoFocus={true}
      />
    </StepWrapper>
  );
};

export const ExpertiseStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  const { data: allServiceCategories } = useServiceCategories({
    page: 1,
    limit: 1000,
  });

  const serviceCategoryOptions = useMemo(() => {
    if (!allServiceCategories?.data?.data?.categories) return [];
    return allServiceCategories?.data?.data?.categories?.map((data: CategoryData) => ({
      value: data.slug,
      label: data.name,
    }));
  }, [allServiceCategories]);

  return (
    <StepWrapper>
      <Label
        isRequired={false}
        variant="lg"
        subtitle="You can select more than one option"
      >
        Select your areas of expertise
      </Label>
      <div className="flex flex-col items-center">
        <Controller
          name="areasOfExpertise"
          control={formMethods.control}
          render={({ field, fieldState }) => (
            <MultiOnBoard
              options={serviceCategoryOptions}
              value={field.value || []}
              onChange={(val: string[]) => {
                field.onChange(val);
                // Clean up category_rates for unselected categories
                const currentRates = (formMethods.getValues("category_rates") as Record<string, any>) || {};
                const newRates: Record<string, any> = {};
                val.forEach((slug) => {
                  if (currentRates[slug]) {
                    newRates[slug] = currentRates[slug];
                  }
                });
                formMethods.setValue("category_rates", newRates);
              }}
              errorMessage={fieldState.error}
              maxHeight="260px"
              // showCheckbox={true}
            />
          )}
        />
      </div>
    </StepWrapper>
  );
};

export const FreelancerReferralDetailsStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<{
    type: "error" | "success" | null;
    text: string;
  }>({ type: null, text: "" });

  const referral = formMethods.watch("freelancerReferralDetails");

  useEffect(() => {
    const checkReferral = async () => {
      if (!referral || referral.trim().length === 0) {
        setAvailabilityMessage({ type: null, text: "" });
        return;
      }

      setIsChecking(true);
      setAvailabilityMessage({ type: null, text: "" });

      const response = await authService.checkValue(referral);

      if (response?.status === 400) { // Successfully found existing user
        setAvailabilityMessage({
          type: "success",
          text: "",
        });
      } else if (response?.status === 200) { // User is "available" i.e. NOT found
        setAvailabilityMessage({
          type: "error",
          text: "We couldn't find a referral with that username or email.",
        });
      } else {
        setAvailabilityMessage({
          type: "success",
          text: "",
        });
      }

      setIsChecking(false);
    };

    const debounceTimer = setTimeout(checkReferral, 500);
    return () => clearTimeout(debounceTimer);
  }, [referral]);

  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        Who referred you?{" "}
      </Label>
      <TextArea
        register={formMethods.register}
        registerOptions="freelancerReferralDetails"
        placeholder="Add their email address or Empera username"
        variant="transparent"
        errors={formMethods.formState.errors}
        maxLength={51}
        autoFocus={true}
      />
      {isChecking && referral && referral.trim().length > 0 && (
        <p className="text-sm text-gray-400 mt-2 text-center">Checking referral...</p>
      )}

      {!isChecking && availabilityMessage.type === "error" && (
        <p className="text-sm text-red-500 mt-2 text-center">{availabilityMessage.text}</p>
      )}
    </StepWrapper>
  );
};

export const PortfolioImagesStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label
        isRequired={false}
        variant={"lg"}
        subtitle="Please upload at least 5 of the 
best pictures of your work"
      >
        Add your portfolio work
      </Label>
      <PhotosPage formMethods={formMethods} />
    </StepWrapper>
  );
};

export const ChargingRateStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  const selectedAreas =
    (formMethods.watch("areasOfExpertise") as string[]) || [];

  const { data: allServiceCategories } = useServiceCategories({
    page: 1,
    limit: 1000,
  });

  const selectedCategories = useMemo(() => {
    if (!allServiceCategories?.data?.data?.categories) return [];
    return allServiceCategories.data.data.categories.filter((cat: CategoryData) =>
      selectedAreas.includes(cat.slug)
    );
  }, [allServiceCategories, selectedAreas]);

  return (
    <StepWrapper>
      <Label
        isRequired={false}
        variant={"lg"}
        subtitle="This helps us understand your experience and the types of bookings you’re open to. You can change this later."
      >
        What are your typical rates?
      </Label>

      <div className="max-h-[340px] overflow-y-auto pr-2 custom-scrollbar w-full">
        {selectedCategories.map((cat: CategoryData, index: number) => {
          const config = getCategoryConfig(cat.name || "", cat.slug || "");
          return (
            <div
              key={cat.slug}
              className={`space-y-6 ${index === 0 ? "mt-6" : "mt-10"}`}
            >
              <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                {cat.name}
              </h2>
              {config.fields.map((field) => (
                <div key={field.key}>
                  <Label isRequired={true}>{field.label}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">£</span>
                    <NumberInputV2
                      register={formMethods.register}
                      registerOptions={`category_rates.${cat.slug}.${field.key}`}
                      placeholder="In GBP"
                      variant="transparent"
                      errors={formMethods.formState.errors}
                      maxLength={6}
                      autoFocus={index === 0 && field.key === config.fields[0].key}
                      textAlignment="text-left"
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </StepWrapper>
  );
};

export const CheckBoxStep: React.FC<StepComponentProps> = ({ formMethods }) => {
  return (
    <StepWrapper spacing="flex flex-col gap-10 mt-[8vh] items-center">
      <div className="flex flex-col gap-2">
        <p className="text-500 text-[24px]">Thank you for your application!</p>
        <p className="w-80 text-center text-wrap text-[14px] font-[400]">
          You&apos;ve been added to our waiting list.<br/>
          You will receive an email once your application is approved.
        </p>
      </div>
      <img src="/welcome_to_empera.png" className="h-full" />
      <Button
        size="rg"
        className="min-h-[51px] font-semibold"
        onClick={() => {
          handleInstagramOpen();
        }}
      >
        Follow us for exclusive perks
      </Button>
    </StepWrapper>
  );
};

