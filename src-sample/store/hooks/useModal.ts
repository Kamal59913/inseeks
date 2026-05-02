import { ModalDataMap, ModalName } from "@/types/modal";
import { useAppDispatch } from ".";
import {
  openModal,
  closeModalById,
  closeTopModal,
  closeAllModals,
} from "../slices/modalSlice";

export const useModalData = () => {
  const dispatch = useAppDispatch();

  return {
    open: <K extends ModalName>(
      ...args: ModalDataMap[K] extends undefined
        ? [type: K]
        : [type: K, data: ModalDataMap[K]]
    ) => {
      dispatch(openModal(args[0], args[1]));
    },
    close: () => dispatch(closeTopModal()),
    closeById: (id: string) => dispatch(closeModalById(id)),
    closeAll: () => dispatch(closeAllModals()),
  };
};
