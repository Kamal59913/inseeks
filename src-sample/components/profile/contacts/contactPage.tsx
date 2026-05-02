"use client";
import { MessageCircle, Mail, MessageSquare } from "lucide-react";
import { Controller } from "react-hook-form";
import { useProfileFormContext } from "@/context/ProfileFormContext";
import Switch from "@/components/ui/form/Switch";
import EmailInput from "@/components/ui/form/EmailInput";
import PhoneInput from "@/components/ui/form/PhoneInput";
import { countries } from "@/lib/utilities/phoneInput";
import { PiWhatsappLogoLight, PiChatCircleTextLight } from "react-icons/pi";

const ContactPage = () => {
  const { formMethods } = useProfileFormContext();

  return (
    <>
      <div>
         <p className="text-white text-[14px] font-normal mb-3">
          {/* This information will appear on your public profile so clients can contact you. <span className="font-[700]">Only share details you&apos;re comfortable making public.</span> */}
        Choose how clients can contact you. Only share details you’re comfortable making public.
        </p>
        <div className="bg-white/10 p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <Controller
              name="isWhatsAppEnabled"
              control={formMethods.control}
              render={({ field }) => (
                <Switch
                  value={field.value}
                  onChange={field.onChange}
                  errors={formMethods.formState.errors}
                  name="isWhatsAppEnabled"
                />
              )}
            />
            

            <label className="text-white text-sm font-bold">WhatsApp</label>
          <PiWhatsappLogoLight className="w-6 h-6 text-white" />
        </div>
        <PhoneInput
          register={formMethods.register}
          registerOptions="whatsapp"
          registerOptionsCountryCode="whatsappCountryCode"
          id="whatsappInput"
          placeholder="0000 000000"
          errors={formMethods.formState.errors}
          maxLength={15}
          countries={countries}
          preValue={formMethods.getValues("whatsapp")}
          preCountryCode={formMethods.getValues("whatsappCountryCode")}
          setValue={formMethods.setValue}
          submitType="merged"
        />
        </div>
      </div>

      <div className="bg-white/10 p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <Controller
              name="isEmailEnabled"
              control={formMethods.control}
              render={({ field }) => (
                <Switch
                  value={field.value}
                  onChange={field.onChange}
                  errors={formMethods.formState.errors}
                  name="isEmailEnabled"
                />
              )}
            />
            

            <label className="text-white text-sm font-bold">Email</label>
          <Mail className="w-6 h-6 text-white" />
        </div>
        <EmailInput
          type="text"
          register={formMethods?.register}
          registerOptions={"additional_email"}
          errors={formMethods?.formState?.errors}
          placeholder="Email"
          maxLength={151}
        />
        </div>



        <div className="bg-white/10 p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <Controller
              name="isTextEnabled"
              control={formMethods.control}
              render={({ field }) => (
                <Switch
                  value={field.value}
                  onChange={field.onChange}
                  errors={formMethods.formState.errors}
                  name="isTextEnabled"
                />
              )}
            />
            

            <label className="text-white text-sm font-bold">Text</label>
          <PiChatCircleTextLight className="w-6 h-6 text-white" />
        </div>
        <PhoneInput
          register={formMethods.register}
          registerOptions="text"
          registerOptionsCountryCode="textCountryCode"
          id="textInput"
          placeholder="0000 000000"
          errors={formMethods.formState.errors}
          maxLength={15}
          countries={countries}
          preValue={formMethods.getValues("text")}
          preCountryCode={formMethods.getValues("textCountryCode")}
          setValue={formMethods.setValue}
          submitType="merged"
        />
        </div>


    </>
  );
};

export default ContactPage;

