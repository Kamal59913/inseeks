"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "@/components/ui/form/PhoneInput";
import Label from "@/components/ui/form/label";
import Input from "@/components/ui/form/Input";
import EmailInput from "@/components/ui/form/EmailInput";
import {
  CustomerValidationContact,
  CustomerValidationContactType,
} from "../validation/customer.validation";
import { countries } from "@/lib/utilities/phoneInput";
import Switch from "@/components/ui/form/Switch";
import Button from "@/components/ui/button/Button";

export default function CustomerStep({
  customerData,
  setCustomerData,
  goNext,
}: {
  customerData: CustomerValidationContactType;
  setCustomerData: (data: CustomerValidationContactType) => void;
  goNext: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<CustomerValidationContactType>({
    resolver: zodResolver(CustomerValidationContact()),
    defaultValues: customerData,
  });

  function onSubmit(data: CustomerValidationContactType) {
    setCustomerData(data);
    goNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <Label isRequired={false}>First Name</Label>
          <Input
            register={register}
            registerOptions="first_name"
            type="text"
            placeholder="First name"
            errors={errors}
            autoFocus={true}
            maxLength={51}
          />
        </div>
        <div>
          <Label isRequired={false}>Last Name</Label>

          <Input
            register={register}
            registerOptions="last_name"
            type="text"
            placeholder="Last name"
            errors={errors}
            maxLength={51}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        <Label isRequired={false}>Phone Number</Label>

        <PhoneInput
          countries={countries}
          register={register}
          registerOptions="phone"
          registerOptionsCountryCode="country_code"
          errors={errors}
          setValue={setValue}
          preValue={getValues("phone")}
          preCountryCode={getValues("country_code")}
          maxLength={16}
          submitType="separated"
        />

        <div>
          <Label isRequired={false}>Email</Label>

          <EmailInput
            register={register}
            registerOptions="email"
            type="text"
            placeholder="Email"
            errors={errors}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="mt-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Controller
                name="enable_newsletter"
                control={control}
                render={({ field }) => (
                  <Switch
                    name="enable_newsletter"
                    value={field.value!}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="enable_newsletter"
                control={control}
                render={({ field }) => (
                  <span
                    className="text-white text-xs font-normal cursor-pointer"
                    onClick={() => field.onChange(!field.value)}
                  >
                    Receive special offers from Empera
                  </span>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          variant="white"
          size="none"
          borderRadius="rounded-lg"
          className="w-full py-3 text-sm font-bold"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
