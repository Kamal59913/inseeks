import React, { useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { useAppForm } from '../../hooks/useAppForm';
import { deleteAvatarSchema } from '../../validations/schemas/profile.schema';
import { useModalData } from '../../store/hooks';
import AppModal from '../Modal/AppModal';
import { userService } from '../../services/user.service';

interface DeleteImageProps {
  modalId: string;
  data?: {
    onComplete?: () => void;
  };
}

export default function DeleteImage({ modalId, data }: DeleteImageProps) {
  const modal = useModalData();
  const [loader, setLoader] = useState(false);
  const payload = data || {};
  const { handleSubmit } = useAppForm({
    schema: deleteAvatarSchema,
    defaultValues: {},
  });

  const closeModal = () => {
    if (modalId) return modal.closeById(modalId);
    modal.close();
  };

  const onSubmit = () => {
    setLoader(true);
    userService
      .deleteAvatar()
      .then((res) => {
        if (res.data.statusCode === 200 && res.data.success === true) {
          payload.onComplete?.();
          closeModal();
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  return (
    <AppModal onClose={closeModal} contentClassName="max-w-[460px] px-4 py-3 sm:px-6 sm:py-16 lg:px-8">
      <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md min-h-[200px]">
        <div className="flex justify">
          {loader && (
            <>
              <p className="absolute font-semibold text-slate-300">Deleting</p>
              <span className="absolute ml-[70px]">
                <PulseLoader color="#475569" size={6} aria-label="Loading Spinner" data-testid="loader" />
              </span>
            </>
          )}
        </div>
        <h2 className="mt-12 w-full text-2xl font-bold leading-tight text-white">
          Sure you want to delete the image?
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loader}
              className="btn-danger w-full items-center justify-center"
            >
              Delete <i className="fa-regular fa-trash-can ml-3"></i>
            </button>
          </div>
        </form>
      </div>
    </AppModal>
  );
}
