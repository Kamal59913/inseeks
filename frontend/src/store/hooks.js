import { useDispatch, useSelector } from "react-redux";
import {
  closeAllModals,
  closeModalById,
  closeTopModal,
  openModal,
} from "./modalSlice";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useModalData = () => {
  const dispatch = useAppDispatch();

  return {
    open: (type, data) => dispatch(openModal(type, data)),
    close: () => dispatch(closeTopModal()),
    closeById: (id) => dispatch(closeModalById(id)),
    closeAll: () => dispatch(closeAllModals()),
  };
};
