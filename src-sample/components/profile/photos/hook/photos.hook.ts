import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { PhotosValidation } from "../validations/photos.validation";

export const usePhotos = (isEditMode: boolean, data?: any) => {
  const isInitialMount = useRef(true);

  const formMethods = useForm({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      image_url: "",
      thumbnail_url: "",
      image_caption: "",
      status: true,
      is_primary: true,
    },
    resolver: zodResolver(PhotosValidation()),
  });

  useEffect(() => {
    if (data) {
      formMethods.reset({
        image_url: data?.image_url || "",
        thumbnail_url: data?.thumbnail_url || "",
        image_caption: data?.caption || "",
        status: data?.status!!,
        is_primary: data?.is_primary!!,
      });
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [data, formMethods]);

  return formMethods;
};

