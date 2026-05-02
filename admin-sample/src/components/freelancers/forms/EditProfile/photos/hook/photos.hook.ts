import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { PhotosValidation } from "../validations/photos.validation";

export const usePhotos = (isEditMode: boolean, data?: any) => {
  console.log("is edit mode", isEditMode);
  const isInitialMount = useRef(true);

  const formMethods = useForm({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      image_url: "",
      thumbnail_url: "",
      caption: "",
      status: true,
      is_primary: true,
      db_id: "",
    },
    resolver: zodResolver(PhotosValidation() as any),
  });

  useEffect(() => {
    if (data) {
      formMethods.reset({
        db_id: data?.db_id || data?.id || "",
        image_url: data?.image_url || "",
        thumbnail_url: data?.thumbnail_url || "",
        caption: data?.caption || data?.image_caption || "",
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
