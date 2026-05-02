export interface ConfirmationModalData {
  title?: string;
  description?: string;
  action: () => void;
  isTitleShow?: boolean;
  cancel?: () => void;
}

export interface EmailSentModalData {
  title: string;
  description: string;
}

export interface BookingActionModalData {
  title: string;
  description: string;
  type: "decline" | "confirm";
  action: (reason?: any) => void;
}

export interface ModalDataMap {
  "log-out": ConfirmationModalData;
  "submit-confirmation": ConfirmationModalData;
  "save-changes-confirmation": ConfirmationModalData;
  "delete-action": ConfirmationModalData;
  "booking-action": BookingActionModalData;
  "email-sent-confirmation": EmailSentModalData;
}

export type ModalName = keyof ModalDataMap;

export interface ModalEntry {
  id: string;
  type: ModalName;
  data?: any; // Kept as any for internal storage, but strictly typed at the entry point
}
