import type { ComponentType } from "react";
import ProfileOne from "../components/modals/profile/profileOne";
import ProfileTwo from "../components/modals/profile/profileTwo";
import DeleteActionModal from "../components/modals/action/delete";
import LogoutActionModal from "../components/modals/action/logout";
import ChangeIsActiveModal from "../components/modals/action/changeIsActive";
import IsPublishedModal from "@/components/modals/action/isPublish";
import CompleteModal from "@/components/modals/action/CompleteModal";
import CancelModal from "@/components/modals/action/CancelModal";
import RefundModal from "@/components/modals/action/RefundModal";
import SaveServicesModal from "../components/modals/action/saveServices";
import ImportFreelancersModal from "../components/modals/action/ImportFreelancersModal";
import PartialRefundModal from "../components/bookings/booking-details/partial-refund-form/PartialRefundModal";

type ModalComponent = ComponentType<{
  modalId: string;
  data?: unknown; // Ensuring data is optional
}>;

export const MODAL_REGISTRY = {
  "profile-1": ProfileOne,
  "profile-2": ProfileTwo,
  "delete-action": DeleteActionModal,
  "log-out": LogoutActionModal,
  "is-active": ChangeIsActiveModal,
  "user-status-modal": IsPublishedModal,
  "complete-modal": CompleteModal,
  "cancel-modal": CancelModal,
  "refund-modal": RefundModal,
  "save-services": SaveServicesModal,
  "import-freelancers": ImportFreelancersModal,
  "partial-refund-modal": PartialRefundModal,
} as const satisfies Record<string, ModalComponent>;

export type ModalType = keyof typeof MODAL_REGISTRY;
