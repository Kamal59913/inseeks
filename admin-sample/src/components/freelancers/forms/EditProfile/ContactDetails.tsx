"use client";

import { MessageCircle, Mail, MessageSquare } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import NumberInputV2 from "@shared/common/components/ui/form/input/NumberInputV2.js";
import EmailInput from "@shared/common/components/ui/form/input/EmailInputField.js";
import Switch from "@shared/common/components/ui/form/switch/Switch.js";

const ContactDetails = () => {
  const { control, register, formState: { errors } } = useFormContext();

  return (
    <div className="flex items-start gap-4">
      {/* WhatsApp */}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Controller
              name="isWhatsAppEnabled"
              control={control}
              render={({ field }) => (
                <Switch name="isWhatsAppEnabled" value={field.value} onChange={field.onChange} />
              )}
            />
            <label className="text-white text-sm font-medium">WhatsApp</label>
          </div>
          <MessageCircle className="w-4 h-4 text-gray-400" />
        </div>
        <NumberInputV2 register={register} registerOptions="whatsapp" placeholder="WhatsApp" errors={errors} maxLength={16} />
      </div>

      {/* Email */}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Controller
              name="isEmailEnabled"
              control={control}
              render={({ field }) => (
                <Switch name="isEmailEnabled" value={field.value} onChange={field.onChange} />
              )}
            />
            <label className="text-white text-sm font-medium">Email</label>
          </div>
          <Mail className="w-4 h-4 text-gray-400" />
        </div>
        <EmailInput register={register} registerOptions="additional_email" errors={errors} placeholder="Email" maxLength={151} />
      </div>

      {/* Text */}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Controller
              name="isTextEnabled"
              control={control}
              render={({ field }) => (
                <Switch name="isTextEnabled" value={field.value} onChange={field.onChange} />
              )}
            />
            <label className="text-white text-sm font-medium">Text</label>
          </div>
          <MessageSquare className="w-4 h-4 text-gray-400" />
        </div>
        <NumberInputV2 register={register} registerOptions="text" errors={errors} placeholder="Text" maxLength={16} />
      </div>
    </div>
  );
};

export default ContactDetails;