"use client";
import BookingActionModal from "@/components/modals/action/booking";
import DeleteActionModal from "@/components/modals/action/delete";
import EmailSentNotificationModal from "@/components/modals/action/emailSentNotification";
import LogoutActionModal from "@/components/modals/action/logout";
import SaveChangesConfirmation from "@/components/modals/action/SaveChangesConfirmation";
import SubmitConfirmation from "@/components/modals/action/SubmitConfirmation";

import type { ComponentType } from "react";

type ModalComponent = ComponentType<{
  modalId: string;
  data?: unknown;
}>;

import { ModalName } from "@/types/modal";

export const MODAL_REGISTRY: Record<ModalName, ModalComponent> = {
  "log-out": LogoutActionModal,
  "submit-confirmation": SubmitConfirmation,
  "save-changes-confirmation": SaveChangesConfirmation,
  "delete-action": DeleteActionModal,
  "booking-action": BookingActionModal,
  "email-sent-confirmation": EmailSentNotificationModal,
} as const;

export type ModalType = ModalName;
