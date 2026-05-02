"use client";

import Input from "@shared/common/components/ui/form/input/InputField.js";
import Label from "@shared/common/components/ui/form/Label.js";
import { useFormContext } from "react-hook-form";

const ProfessionalProfile = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <Label>Referral Details</Label>
        <Input
          register={register}
          registerOptions="freelancerReferralDetails"
          errors={errors}
          placeholder="Referral details..."
        />
      </div>
      <div></div>
    </div>
  );
};

export default ProfessionalProfile;
