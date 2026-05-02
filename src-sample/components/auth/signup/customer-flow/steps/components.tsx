import Label from "@/components/ui/form/label";
import { StepComponentProps } from "./types";
import { StepWrapper } from "./utils";
import Input from "@/components/ui/form/Input";
import EmailInput from "@/components/ui/form/EmailInput";
import Button from "@/components/ui/button/Button";
import { Controller } from "react-hook-form";
import { SingleOnBoard } from "@/components/ui/dropdown/SingleOnboardController";
import { customerTypeOptions } from "../utils/customerTypeOptions";
import PhoneInput from "@/components/ui/form/PhoneInput";
import { countries } from "@/lib/utilities/phoneInput";
import {
  handleInstagramOpen,
  LinkOpener,
} from "@/lib/utilities/socialLinks";

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
    </StepWrapper>
  );
};

export const AdvertisementStep: React.FC<StepComponentProps> = () => (
  <StepWrapper spacing="mt-[4vh]">
    <h1 className="text-[24px] font-semibold text-center">
      Empera is for every moment
    </h1>

    <p className="text-center text-[13px] text-gray-300 max-w-sm mx-auto mb-8">
      Book trusted beauty freelancers for both professional campaigns and
      personal moments.
    </p>

    <div className="flex flex-col gap-8 w-full max-w-sm mx-auto">
      <div className="flex flex-row gap-2">
        <div className="overflow-hidden rounded-2xl flex-shrink-0">
          <img
            src="/for_your_moments.png"
            alt="For your moments"
            className="object-cover w-32 h-40"
          />
        </div>
        <div className="flex flex-col justify-center text-left px-5">
          <h2 className="text-[14px] font-medium mb-1">For your moments</h2>
          <p className="text-gray-400 text-[12px]">
            Weddings, nights out, special occasions.
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <div className="flex flex-col justify-center text-left order-1 px-5">
          <h2 className="text-[14px] font-medium mb-1">For your campaigns</h2>
          <p className="text-gray-400 text-[12px]">
            Photoshoots, runways, commercials.{" "}
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl flex-shrink-0 order-2">
          <img
            src="/for_your_campaigns.png"
            alt="For your campaigns"
            className="object-cover w-32 h-40"
          />
        </div>
      </div>
    </div>
  </StepWrapper>
);

// export const WelcomeScreenStep: React.FC<StepComponentProps> = ({
//   formMethods,
// }) => {
//   const email = formMethods?.getValues("email");

//   // ✅ Opens Gmail/Outlook inbox in a new tab
//   const handleCheckInbox = () => {
//     const domain = email?.split("@")[1] || "";

//     if (domain.includes("gmail")) {
//       window.open("https://mail.google.com/", "_blank");
//     } else if (domain.includes("outlook") || domain.includes("hotmail")) {
//       window.open("https://outlook.live.com/mail/", "_blank");
//     } else if (domain.includes("yahoo")) {
//       window.open("https://mail.yahoo.com/", "_blank");
//     } else {
//       // fallback for other domains
//       window.open("https://www." + domain, "_blank");
//     }
//   };
//   return (
//     <CheckInboxWrapper>
//       <img src="/check_your_inbox.png" className="h-40 w-40" />
//       <p className="text-500 text-[24px]">Check your inbox</p>
//       <p className="w-80 text-center text-wrap wrap-break-word mb-10">
//         {formMethods?.getValues("email") ? (
//           <>
//             To confirm your email, tap on the link we sent to{" "}
//             {formMethods?.getValues("email")}
//           </>
//         ) : (
//           ""
//         )}
//       </p>
//       <Button
//         className="font-semibold w-full"
//         onClick={handleCheckInbox}
//         disabled={!email}
//       >
//         Book a freelance via WhatsApp{" "}
//       </Button>
//       <Button variant="dark" className="font-semibold w-full" type="submit">
//         Follow us for exclusive perks{" "}
//       </Button>
//     </CheckInboxWrapper>
//   );
// };
export const WelcomeScreenStep: React.FC<StepComponentProps> = () => {
  return (
    <StepWrapper spacing="flex flex-col gap-10 justify-center items-center mt-[12vh]">
      <div className="flex flex-col items-center gap-2">
        <p className="text-500 text-[24px] text-center max-w-md">
          You&apos;ve joined the Empera App Early Access List
        </p>
        <p className="text-center text-wrap text-[16px] max-w-xs">
          We will notify you when the Mobile App is ready to download.{" "}
        </p>
      </div>
      <img src="/welcome_to_empera.png" className="w-full max-w-md" />
      <div className="flex flex-col w-74 max-w-sm gap-3">
        <Button
          size="rg"
          // onClick={handleWhatsappOpen}
          onClick={(e) => {
            e.stopPropagation();
            LinkOpener(process.env.NEXT_PUBLIC_FREELANCER_WEB_PAGE!!);
          }}
          className="font-semibold w-full text-[14px]"
        >
          Book a freelancer{" "}
        </Button>

        <Button
          size="rg"
          variant="dark"
          className="font-semibold w-full text-[14px]"
          onClick={() => {
            handleInstagramOpen();
          }}
        >
          Follow us for exclusive perks
        </Button>
      </div>
    </StepWrapper>
  );
};

export const CustomerTypeStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant="lg">
        How will you use Empera?
      </Label>
      <Controller
        name="customerType"
        control={formMethods.control}
        render={({ field, fieldState }) => (
          <SingleOnBoard
            title=""
            options={customerTypeOptions}
            value={field.value}
            onChange={field.onChange}
            errorMessage={fieldState.error}
          />
        )}
      />
    </StepWrapper>
  );
};

export const CompanyNameStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant="lg">
        What&apos;s your company called?
      </Label>
      <Input
        register={formMethods.register}
        registerOptions="companyName"
        type="text"
        placeholder="Company Name"
        variant="transparent"
        errors={formMethods.formState.errors}
      />
    </StepWrapper>
  );
};

export const CompanyRoleStep: React.FC<StepComponentProps> = ({
  formMethods,
}) => {
  return (
    <StepWrapper>
      <Label isRequired={false} variant="lg">
        What&apos;s your role?
      </Label>
      <Input
        register={formMethods.register}
        registerOptions="companyPosition"
        type="text"
        placeholder="Company Position"
        variant="transparent"
        errors={formMethods.formState.errors}
        autoFocus={true}
      />
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

