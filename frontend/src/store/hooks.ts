import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import {
  closeAllModals,
  closeModalById,
  closeTopModal,
  openModal,
} from "./modalSlice";
import type { ModalName } from "../types/modal";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useModalData = () => {
  const dispatch = useAppDispatch();

  return {
    open: <K extends ModalName>(type: K, data?: any) =>
      dispatch(openModal(type, data)),
    close: () => dispatch(closeTopModal()),
    closeById: (id: string) => dispatch(closeModalById(id)),
    closeAll: () => dispatch(closeAllModals()),
  };
};
