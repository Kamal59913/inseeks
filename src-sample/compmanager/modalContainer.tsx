"use client"
import { useAppSelector } from '@/store/hooks';
import { MODAL_REGISTRY, ModalType } from './modals';

const ModalContainer:React.FC = () => {
  const { stack } = useAppSelector((state) => state.modal);
  return (
    <>
      {stack.map((modal) => {
        // Type assertion for modal type
        const modalType = modal.type as ModalType;
        const ModalComponent = MODAL_REGISTRY[modalType];
        
        return ModalComponent ? (
          <ModalComponent
            key={modal.id}
            modalId={modal.id}
            data={modal.data}
          />
        ) : null;
      })}
    </>
  );
};
export default ModalContainer;
