import Label from "@/components/ui/form/label";
import { StepComponentProps } from "./types";
import {
  InfoWrapper,
  MapBoxWrapper,
  StepWrapper,
} from "./utils";
import Input from "@/components/ui/form/Input";
import Button from "@/components/ui/button/Button";
import { PasswordInput } from "@/components/ui/form/PasswordInput";
import PostcodeAddressForm from "@/components/ui/form/SearchableListInput";
import MapBoxRadiusSelector from "@/components/features/mapboxmap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import authService from "@/services/authService";

export const WelcomeScreenStep: React.FC<StepComponentProps> = ({}) => {
  return (
    <StepWrapper spacing="flex flex-col gap-10 mt-[15vh] items-center">
     <div className="flex flex-col gap-2 items-center">
      <p className="text-500 text-[24px]">Welcome to Empera</p>
      <p className="w-80 text-center text-wrap">
        Your talent deserves the spotlight. Start building your profile and
        connect with clients who value your craft.
      </p>
      </div>
      <img src="/welcome_to_empera.png" className="h-full mb-6" />
    </StepWrapper>
  );
};

export const PasswordStep: React.FC<StepComponentProps> = ({ formMethods }) => {
  const password = formMethods.watch("password") || "";

  const validations = {
    lengthAndMix:
      password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password),
    upperCase: /[A-Z]/.test(password)
    // specialChar: /[#./]/.test(password),
  };

  const startTyping = password.length > 0;

  const getValidationClass = (isValid: boolean) => {
    if (!startTyping) return "text-white/60"; // Default/Inactive color
    return isValid ? "text-white" : "text-red-400";
  };

  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        Set up a password
      </Label>

      <div className="mb-6">
        <p
          className={`text-md text-center transition-colors duration-200 ${getValidationClass(
            validations.lengthAndMix
          )}`}
        >
          Use at least 8 characters with a mix of letters and numbers.
        </p>
      </div>

      <PasswordInput
        register={formMethods.register}
        registerOptions="password"
        placeholder="Password"
        variant="transparent"
        showToggleIcon={true}
        errors={formMethods.formState.errors}
        autoFocus={true}
      />

      <div className="mt-6 flex flex-col gap-2 items-center">
        <p
          className={`text-[15px] transition-colors duration-200 ${getValidationClass(
            validations.upperCase
          )}`}
        >
          Must include 1 Upper Case
        </p>
        {/* <p
          className={`text-[15px] transition-colors duration-200 ${getValidationClass(
            validations.specialChar
          )}`}
        >
          Must include 1 of thees characters #/.
        </p> */}
      </div>
    </StepWrapper>
  );
};

export const UserNameStep: React.FC<StepComponentProps> = ({ formMethods }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<{
    type: "error" | "success" | null;
    text: string;
  }>({ type: null, text: "" });

  const userName = formMethods.watch("userName");

  useEffect(() => {
    const checkUsername = async () => {
      if (!userName || userName.length < 3) {
        setAvailabilityMessage({ type: null, text: "" });
        return;
      }

      setIsChecking(true);
      setAvailabilityMessage({ type: null, text: "" });

      const response = await authService.checkUsername(userName);

      if (response?.status === 200) {
        setAvailabilityMessage({
          type: "success",
          text: "",
        });
      } else if (response?.status === 400) {
        setAvailabilityMessage({
          type: "error",
          text: "This username is already taken. Please try another.",
        });
      } else {
        // Handle any other unexpected status codes
        setAvailabilityMessage({
          type: "success",
          text: "",
        });
      }

      setIsChecking(false);
    };

    const debounceTimer = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounceTimer);
  }, [userName]);

  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        Pick a username
      </Label>
      <Input
        register={formMethods.register}
        registerOptions="userName"
        type="text"
        placeholder="username"
        variant="transparent"
        errors={formMethods.formState.errors}
        noOfSpaceAllowed={0}
        maxLength={51}
        autoFocus={true}
      />

      {isChecking && userName && userName.length >= 3 && (
        <p className="text-sm text-gray-400 mt-2">Checking availability...</p>
      )}

      {!isChecking && availabilityMessage.type === "error" && (
        <p className="text-sm text-red-500 mt-2">{availabilityMessage.text}</p>
      )}

      {userName && userName.length >= 3 && (
        <div className="mt-4 text-center wrap-break-word">
          <p className="text-sm text-gray-400">
            This will be your unique profile link:
          </p>
          <p className="text-sm text-gray-300 mt-1">
            {`emperabeauty.com/${
              userName.length > 50 ? userName.slice(0, 50) + "..." : userName
            }`}
          </p>{" "}
        </div>
      )}
    </StepWrapper>
  );
};

export const PostalCodeStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant={"lg"}>
        Where are you based?
      </Label>
      <PostcodeAddressForm
        formMethods={formMethods}
        field={"freelancerAddress"}
        typingField={"freelancerPostalCode"}
      />
    </StepWrapper>
  );
};

export const TravelZoneStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <MapBoxWrapper>
      <Label isRequired={false} variant={"lg"}>
        How far are you willing to travel?
      </Label>
      <MapBoxRadiusSelector formMethods={formMethods} />
    </MapBoxWrapper>
  );
};

export const DashboardRedirectStep: React.FC<StepComponentProps> = ({}) => {
  const router = useRouter();
  return (
    <InfoWrapper>
      <div className="flex flex-col items-center justify-center gap-12 mt-[10vh]">
        <div className="flex flex-col items-center gap-2">
        <p className="text-500 text-[24px] text-center">
          Your profile is now live on Empera
        </p>
        <p className="w-80 text-center text-wrap">
          To start receiving bookings, make sure to complete the rest of your
          details in your dashboard.
        </p>
        </div>
        <Button
          size="rg"
          className="font-semibold w-72"
          onClick={() => {
            router.push("/profile/information");
          }}
        >
          Go to my dashboard
        </Button>
      </div>
    </InfoWrapper>
  );
};

