"use client";

import React from "react";
import { useModalStore, ModalEntry } from "@/store/useModalStore";

// Import modal components
import CreateNewModal from "./CreateNew/CreateNewModal";
import StoryModal from "./StoryModal";
import NensAppModal from "./NensAppModal";
import LogoutModal from "./LogoutModal";
import ImageCropperModal from "./ImageCropperModal";
import DeactivateModal from "./DeactivateModal";
import PasswordModal from "./PasswordModal";
import QrCodeModal from "./QrCodeModal";
import ImagePreviewModal from "./ImagePreviewModal";
import ConfirmationModal from "./ConfirmationModal";
import ReportPostModal from "./ReportPostModal";
import ReportCommentModal from "./ReportCommentModal";
import ReactivateModal from "./ReactivateModal";
import ReactionsDetailModal from "./ReactionsDetailModal";
import BlockedUsersModal from "./BlockedUsersModal";
import FollowListModal from "./FollowListModal";
import EditFeedModal from "./EditFeedModal";

// Modal type registry - maps modal type strings to components
const MODAL_COMPONENTS: Record<string, React.ComponentType<{ modal: ModalEntry; onClose: () => void }>> = {
  "blocked-users": BlockedUsersModal,
  "follow-list": FollowListModal,
  "edit-feed": EditFeedModal,
  "create-new": CreateNewModal,
  "story": StoryModal,
  "nensapp": NensAppModal,
  "logout": LogoutModal,
  "image-cropper": ImageCropperModal,
  "deactivate-account": DeactivateModal,
  "change-password": PasswordModal,
  "qr-code": QrCodeModal,
  "image-preview": ImagePreviewModal,
  "confirmation": ConfirmationModal,
  "report-post": ReportPostModal,
  "report-comment": ReportCommentModal,
  "reactivate-account": ReactivateModal,
  "reactions-detail": ReactionsDetailModal,
};

const ModalRegistry = () => {
  const { stack, closeModalById } = useModalStore();

  if (stack.length === 0) return null;

  return (
    <>
      {stack.map((modal) => {
        const ModalComponent = MODAL_COMPONENTS[modal.type];
        
        if (!ModalComponent) {
          console.warn(`Unknown modal type: ${modal.type}`);
          return null;
        }

        return (
          <ModalComponent
            key={modal.id}
            modal={modal}
            onClose={() => closeModalById(modal.id)}
          />
        );
      })}
    </>
  );
};

export default ModalRegistry;
