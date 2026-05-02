"use client";

import Input from "@shared/common/components/ui/form/input/InputField.js";
import TextArea from "@shared/common/components/ui/form/input/TextArea.js";
import Label from "@shared/common/components/ui/form/Label.js";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// Assuming Input is available here based on other files, or I will use standard input

const BasicInformation = () => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>First Name</Label>
        <Input
          register={register}
          registerOptions="firstName"
          errors={errors}
          placeholder="First Name"
          maxLength={51}
        autoFocus={true}
        />
      </div>
      <div>
        <Label>Last Name</Label>
        <Input
          register={register}
          registerOptions="lastName"
          errors={errors}
          placeholder="Last Name"
                    maxLength={51}

        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          register={register}
          registerOptions="email"
          errors={errors}
          placeholder="Email"
          maxLength={151}
        />
      </div>
      <div>
        <Label>Phone Number</Label>
        <div className="relative">
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                containerClass="w-full"
                inputClass="!w-full !h-[44px]"
                country="gb"
                value={value}
                onChange={(phone, country: any) => {
                  setValue("phoneData", {
                    fullPhone: phone,
                    countryCode: `+${country.dialCode}`,
                    phoneNumber: phone.replace(country.dialCode, ""),
                  });
                  onChange(phone);
                }}
                placeholder="1 (800) 123-4567"
              />
            )}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors?.phone?.message?.toString()}
            </p>
          )}
        </div>

      </div>
      <div>
        <Label>Instagram Handle</Label>
        <Input
          register={register}
          registerOptions="instagramHandle"
          errors={errors}
          placeholder="@username"
          maxLength={51}
        />
      </div>
      <div className="md:col-span-2">
        <Label>Bio</Label>
        <TextArea
          register={register}
          registerOptions="freelancerBio"
          errors={errors}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={501}
        />
      </div>
    </div>
  );
};

export default BasicInformation;
