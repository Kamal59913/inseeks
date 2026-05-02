"use client";
import Input from "@shared/common/components/ui/form/input/InputField.js";
import { PasswordInput } from "@shared/common/components/ui/form/input/PasswordInput.js";
import Label from "@shared/common/components/ui/form/Label.js";
import { useFormContext } from "react-hook-form";

const AccountDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Username</Label>
        <Input
          register={register}
          registerOptions="userName"
          errors={errors}
          placeholder="Username"
        />
      </div>
      <div>
        <Label>Password</Label>
        <PasswordInput
          register={register}
          registerOptions="password"
          errors={errors}
          placeholder="Password (leave empty to keep unchanged)"
        />
      </div>
      <div>
        <Label>Postal Code</Label>
        <Input
          register={register}
          registerOptions="freelancerPostalCode"
          errors={errors}
          placeholder="Postal Code"
        />
      </div>
      {/* <div>
        <Label>Email Verified</Label>
        <Controller
          name="isEmailVerified"
          control={control}
          render={({ field }) => (
            <Switch
              name="isEmailVerified"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div> */}
    </div>
  );
};

export default AccountDetails;
