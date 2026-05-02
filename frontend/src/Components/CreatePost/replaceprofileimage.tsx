import React, { useMemo, useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { FormFileField } from '../Common/FormFields';
import { useAppForm } from '../../hooks/useAppForm';
import { replaceAvatarSchema } from '../../validations/schemas/profile.schema';
import { useModalData } from '../../store/hooks';
import AppModal from '../Modal/AppModal';
import { userService } from '../../services/user.service';
import ImageWithFallback from '../Common/ImageWithFallback';

interface ReplaceImagesProps {
  modalId: string;
  data?: { onComplete?: () => void };
}

export default function ReplaceImages({ modalId, data }: ReplaceImagesProps) {
  const modal = useModalData();
  const [loader, setLoader] = useState(false);
  const payload = data || {};
  const { control, handleSubmit, watch, reset } = useAppForm({
    schema: replaceAvatarSchema,
    defaultValues: { avatar: null },
  });

  const image = watch('avatar');
  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);

  const closeModal = () => { if (modalId) return modal.closeById(modalId); modal.close(); };

  const onSubmit = (values: any) => {
    setLoader(true);
    userService.updateAvatar(values.avatar)
      .then((res) => { if (res.data.statusCode === 200 && res.data.success) { payload.onComplete?.(); reset(); closeModal(); } })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  return (
    <AppModal onClose={closeModal} contentClassName="max-w-[460px] px-4 py-4 sm:px-6 sm:py-16 lg:px-8">
      <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
        <h2 className="text-2xl font-bold leading-tight text-slate-600 mt-3">Add Display Image</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
          <div className="space-y-3">
            <div className="mt-3">
              <p className="inline-flex font-semibold text-lg">Insert</p>
              <span className="ml-4 inline-flex"><FormFileField control={control} name="avatar" accept="image/*"/></span>
              {loader && <><span className="ml-2 text-slate-800"> Uploading </span><span className="ml-2"><PulseLoader color="#475569" size={6}/></span></>}
            </div>
            <div className="h-[220px] w-full bg-slate-600 mt-1 flex justify-center">
              {previewUrl && <ImageWithFallback className="bg-slate-200 h-full w-64 rounded-2xl" src={previewUrl} alt=""/>}
            </div>
            <button type="submit" disabled={loader} className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-slate-600 focus:outline-none disabled:opacity-70">Post</button>
          </div>
        </form>
      </div>
    </AppModal>
  );
}
