"use client";
import React from "react";
import Input from "./Input";

interface PostCodeAddressFormProp {
  formMethods: any;
  field: string;
  typingField: string;
}

const PostcodeAddressForm: React.FC<PostCodeAddressFormProp> = ({
  formMethods,
  // field is unused now as we only collect manual postcode
  typingField,
}) => {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 text-center">
        <p className="text-sm text-gray-400">
          {/* This helps clients understand where you&apos;re based.{" "}
           */}
          Enter your postcode to set your travel area for bookings. Your exact
          address stays private and is never shown to clients.
        </p>
        {/* <p className="text-sm text-gray-400">
          Your address will remain private and never shown publicly.
        </p> */}
      </div>

      <Input
        register={formMethods.register}
        registerOptions={typingField}
        type="text"
        placeholder="Postcode"
        variant="transparent"
        errors={formMethods.formState.errors}
        maxLength={10}
        autoFocus={true}
      />
    </div>
  );
};

export default PostcodeAddressForm;

