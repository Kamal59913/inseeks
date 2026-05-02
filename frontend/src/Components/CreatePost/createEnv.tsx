import React, { useMemo, useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { FormField, FormFileField, FormTextarea } from '../Common/FormFields';
import { useAppForm } from '../../hooks/useAppForm';
import { createEnvSchema } from '../../utils/formSchemas';
import { preprocessTrimmedFormData } from '../../utils/formValidation';
import { useModalData } from '../../store/hooks';
import AppModal from '../Modal/AppModal';
import { envService } from '../../services/env.service';
import ImageWithFallback from '../Common/ImageWithFallback';

interface CreateEnvProps {
  modalId: string;
  data?: {
    onCreated?: () => void;
  };
}

export function CreateEnv({ modalId, data }: CreateEnvProps) {
  const modal = useModalData();
  const [loader, setLoader] = useState(false);
  const payload = data || {};
  const { control, handleSubmit, watch, reset } = useAppForm({
    schema: createEnvSchema,
    defaultValues: { envName: '', EnvDescription: '', envCoverImage: null },
  });

  const envCoverImage = watch('envCoverImage');
  const previewUrl = useMemo(
    () => (envCoverImage ? URL.createObjectURL(envCoverImage) : null),
    [envCoverImage],
  );

  const closeModal = () => {
    if (modalId) return modal.closeById(modalId);
    modal.close();
  };

  const onSubmit = (values: Record<string, unknown>) => {
    setLoader(true);
    const { envName, EnvDescription, envCoverImage: coverImage } = preprocessTrimmedFormData(values);
    envService
      .createEnvironment({
        envName: envName as string,
        EnvDescription: EnvDescription as string,
        envCoverImage: coverImage as File,
      })
      .then((res) => {
        if (res.data.statusCode === 200 && res.data.success === true) {
          payload.onCreated?.();
          reset();
          closeModal();
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  return (
    <AppModal onClose={closeModal} contentClassName="max-w-[460px] px-4 py-4 sm:px-6 sm:py-16 lg:px-8">
      <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
        <h2 className="mt-3 text-2xl font-bold leading-tight text-white">Create a space</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
          <div className="space-y-3">
            <FormField control={control} name="envName" placeholder="Space Name" maxLength={80} />
            <FormTextarea control={control} name="EnvDescription" placeholder="Space Description (Required)" rows={4} maxLength={500} />
            <div className="mt-3">
              <p className="inline-flex text-lg font-semibold text-slate-200">Add</p>
              <span className="ml-4 inline-flex">
                <FormFileField control={control} name="envCoverImage" accept="image/*" />
              </span>
              {loader && (
                <>
                  <span className="ml-2 text-slate-400"> Uploading </span>
                  <span className="ml-2">
                    <PulseLoader color="#475569" size={6} aria-label="Loading Spinner" data-testid="loader" />
                  </span>
                </>
              )}
            </div>
            <div className="surface-subtle mt-1 flex h-[180px] w-full items-center justify-center rounded-2xl">
              {previewUrl && <ImageWithFallback className="h-full w-64 bg-slate-200" src={previewUrl} alt="" />}
            </div>
            <button
              type="submit"
              disabled={loader}
              className="btn-primary relative inline-flex w-full"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </AppModal>
  );
}
