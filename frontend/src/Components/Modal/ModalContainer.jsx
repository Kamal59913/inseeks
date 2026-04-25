import React from "react";
import { useAppSelector } from "../../store/hooks";
import { MODAL_REGISTRY } from "./modalRegistry";

export default function ModalContainer() {
  const stack = useAppSelector((state) => state.modal.stack);

  return (
    <>
      {stack.map((modal) => {
        const ModalComponent = MODAL_REGISTRY[modal.type];

        if (!ModalComponent) return null;

        return (
          <ModalComponent
            key={modal.id}
            modalId={modal.id}
            data={modal.data}
          />
        );
      })}
    </>
  );
}
