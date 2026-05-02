"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@repo/ui/index";
import { ModalEntry, useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetFollowedCommunities } from "@/hooks/communityServices/useGetFollowedCommunities";
import { useCreateFeedForm } from "./CreateNew/hook/use-create-new-form.hook";
import { CreateFeedValidationType } from "./CreateNew/validation/createNew.validation";
import { CreateFeedView } from "./CreateNew/feed/CreateFeedView";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import { ToastService } from "@/lib/utilities/toastService";
import feedService from "@/lib/api/services/feedService";

interface EditFeedModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

interface FeedCommunityOption {
  id: string | number;
  name?: string;
  profile_photo_url?: string;
}

interface EditableFeed {
  id: string | number;
  title?: string;
  description?: string;
  avatar_url?: string;
  community_id?: string | number | null;
  community?: FeedCommunityOption | null;
  is_followed?: boolean;
}

interface FeedMutationResponse {
  status?: boolean | number;
  message?: string;
}

const EditFeedModal = ({ modal, onClose }: EditFeedModalProps) => {
  const feed = useMemo<EditableFeed>(() => {
    const modalData = modal.data as { feed?: EditableFeed } | undefined;
    return modalData?.feed ?? ({ id: "" } as EditableFeed);
  }, [modal.data]);
  const { userData } = useAuthStore();
  const { openModal } = useModalStore();
  const { updateFeedCache } = useAppInvalidation();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [feedAvatar, setFeedAvatar] = useState<{ blob: Blob | null; preview: string }>({
    blob: null,
    preview: feed?.avatar_url || "",
  });
  const feedForm = useCreateFeedForm(feed);

  useEffect(() => {
    feedForm.reset({
      title: feed?.title || "",
      mainPost: feed?.description || "",
      communityId: (feed?.community_id || feed?.community?.id || "")?.toString(),
    });
    setFeedAvatar({ blob: null, preview: feed?.avatar_url || "" });
  }, [feed, feedForm]);

  const { data: followedCommunitiesData } = useGetFollowedCommunities({
    enabled: !!userData?.id,
  });

  const followedCommunities = useMemo(() => {
    const communities = (followedCommunitiesData?.data || []) as FeedCommunityOption[];
    const currentCommunity =
      feed?.community?.id != null
        ? {
            id: feed.community.id,
            name: feed.community.name,
            profile_photo_url: feed.community.profile_photo_url,
          }
        : null;

    if (!currentCommunity) {
      return communities;
    }

    const hasCurrentCommunity = communities.some(
      (community: any) => String(community.id) === String(currentCommunity.id),
    );

    return hasCurrentCommunity ? communities : [currentCommunity, ...communities];
  }, [feed?.community, followedCommunitiesData?.data]);

  const updateMutation = useMutation<FeedMutationResponse, Error, CreateFeedValidationType>({
    mutationFn: (values: CreateFeedValidationType) =>
      feedService.updateFeed(feed.id, {
        title: values.title || "",
        description: values.mainPost || "",
        community_id: values.communityId ? Number(values.communityId) : null,
        avatar_url: feedAvatar.preview || "",
        community:
          followedCommunities.find(
            (community) =>
              String(community.id) === String(values.communityId || ""),
          ) || null,
      }),
    onSuccess: (response, values) => {
      if (!(response?.status === true || response?.status === 200)) {
        ToastService.error(response?.message || "Failed to update feed");
        return;
      }

      const selectedCommunity =
        followedCommunities.find(
          (community) =>
            String(community.id) === String(values.communityId || ""),
        ) || null;

      const updatedFields = {
        title: values.title || "",
        description: values.mainPost || "",
        community_id: values.communityId ? Number(values.communityId) : null,
        avatar_url: feedAvatar.preview || "",
        community: selectedCommunity
          ? {
              ...(feed?.community || {}),
              ...selectedCommunity,
            }
          : null,
      };

      updateFeedCache(
        feed.id,
        feed?.is_followed ?? false,
        (existingFeed: EditableFeed) => ({
          ...existingFeed,
          ...updatedFields,
        }),
      );

      ToastService.success(response?.message || "Feed updated successfully");
      onClose();
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to update feed");
    },
  });

  const handleSubmit = async (values: CreateFeedValidationType) => {
    await updateMutation.mutateAsync(values);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[min(96vw,720px)] max-w-[720px] overflow-hidden border-0 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">Edit Feed</DialogTitle>
        <CreateFeedView
          onBack={onClose}
          isLoading={updateMutation.isPending}
          user={userData}
          followedCommunities={followedCommunities}
          feedForm={feedForm}
          onSubmit={handleSubmit}
          heading="Edit Feed"
          submitLabel="Save Changes"
          formId={`edit-feed-form-${feed?.id || "draft"}`}
          containerClassName="h-[80vh] max-h-[640px] rounded-none p-5 shadow-none"
          selectedMedia={[]}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          onEmojiClick={(emojiData: any) => {
            const currentValue = feedForm.getValues("mainPost") || "";
            feedForm.setValue("mainPost", `${currentValue}${emojiData.emoji}`, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
          feedAvatar={feedAvatar}
          setFeedAvatar={setFeedAvatar}
          openModal={openModal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditFeedModal;
