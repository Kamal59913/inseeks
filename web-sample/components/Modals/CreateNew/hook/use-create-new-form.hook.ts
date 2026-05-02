import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePostValidation,
  CreatePostValidationType,
  CreateFeedValidation,
  CreateFeedValidationType,
} from "../validation/createNew.validation";

const normalizePostType = (type?: string): CreatePostValidationType["type"] => {
  if (type === "gif") return "photo";
  if (type === "photo" || type === "video" || type === "text") return type;
  return "text";
};

export const useCreatePostForm = (
  initialData?: any,
  isFromFeedPage: boolean = false,
) => {
  const formMethods = useForm<CreatePostValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: useMemo(
      () => zodResolver(CreatePostValidation(isFromFeedPage)),
      [isFromFeedPage],
    ) as any,
    defaultValues: {
      content: initialData?.text_content || "",
      communityId: initialData?.community_id?.toString() || "",
      feedId: initialData?.feed_id?.toString() || "",
      type: normalizePostType(initialData?.type),
    },
  });

  useEffect(() => {
    if (initialData) {
      formMethods.reset({
        content: initialData?.text_content || "",
        communityId: initialData?.community_id?.toString() || "",
        feedId: initialData?.feed_id?.toString() || "",
        type: normalizePostType(initialData?.type),
      });
    }
  }, [initialData]);

  return formMethods;
};

export const useCreateFeedForm = (initialData?: any) => {
  const formMethods = useForm<CreateFeedValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(CreateFeedValidation),
    defaultValues: {
      title: initialData?.title || "",
      mainPost: initialData?.description || "",
      communityId: initialData?.community_id?.toString() || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      formMethods.reset({
        title: initialData?.title || "",
        mainPost: initialData?.description || "",
        communityId: initialData?.community_id?.toString() || "",
      });
    }
  }, [initialData]);

  return formMethods;
};
