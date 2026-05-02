import React from 'react';
import { useModalData } from '../../store/hooks';
import AppModal from './AppModal';
import Button from '../Common/Button';

interface ConfirmationModalProps {
  modalId: string;
  data: {
    title: string;
    description?: string;
    confirmLabel?: string;
    action?: () => void;
    onConfirm?: () => void | Promise<void>;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ modalId, data }) => {
  const { close } = useModalData();

  const handleConfirm = async () => {
    if (data?.onConfirm) {
      await data.onConfirm();
    } else if (data?.action) {
      data.action();
    }
    close();
  };

  return (
    <AppModal onClose={() => close()} contentClassName="max-w-4xl mx-auto">
      <div className="text-center p-8 lg:p-12 rounded-3xl bg-transparent">
        <div className="mb-8">
          <h4 className="text-3xl font-bold text-white mb-3">
            {data?.title || 'Are you sure?'}
          </h4>
          <p className="text-slate-400 text-base">
            {data?.description || 'Please confirm your action to proceed.'}
          </p>
        </div>

        <div className="flex items-center gap-4 justify-center max-w-lg mx-auto">
          <Button
            variant="custom"
            onClick={() => close()}
            className="flex-1 field-subtle hover:bg-[#1b2742] text-slate-300 font-bold py-4 px-8 rounded-2xl"
          >
            Cancel
          </Button>
          <Button
            variant="custom"
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-red-600/20"
          >
            {data?.confirmLabel || 'Confirm'}
          </Button>
        </div>
      </div>
    </AppModal>
  );
};

export default ConfirmationModal;
