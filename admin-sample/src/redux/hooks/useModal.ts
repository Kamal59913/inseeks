import { useAppDispatch } from ".";
import { openModal, closeModalById, closeTopModal, closeAllModals } from "../slices/modalSlice";

export const useModalData = () => {
  const dispatch = useAppDispatch();

  return {
    open: <T = unknown>(type: string, data?: T) => {
      dispatch(openModal(type, data));
    },
    close: () => dispatch(closeTopModal()),
    closeById: (id: string) => dispatch(closeModalById(id)),
    closeAll: () => dispatch(closeAllModals()),
  };
};