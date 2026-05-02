import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react';
import PulseLoader from 'react-spinners/PulseLoader';
import { FormField, FormTextarea } from '../Common/FormFields';
import { useAppForm } from '../../hooks/useAppForm';
import { createEnvSchema } from '../../validations/schemas/post.schema';
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const payload = data || {};
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const { control, handleSubmit, watch, reset } = useAppForm({
    schema: createEnvSchema,
    defaultValues: { envName: '', EnvDescription: '', envCoverImage: null },
  });
  const { field: envCoverImageField } = useController({
    control,
    name: 'envCoverImage' as never,
  });

  const envCoverImage = watch('envCoverImage');
  const previewUrl = useMemo(
    () => (envCoverImage ? URL.createObjectURL(envCoverImage) : null),
    [envCoverImage],
  );

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const closeModal = () => {
    if (modalId) return modal.closeById(modalId);
    modal.close();
  };

  const setCoverImage = (file: File | null) => {
    envCoverImageField.onChange(file);
    setSubmitError(null);
  };

  const handleCoverImageChange = (files: FileList | null) => {
    const file = files?.[0] || null;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmitError('Please choose an image file for the space cover.');
      return;
    }

    setCoverImage(file);
  };

  const onSubmit = (values: Record<string, unknown>) => {
    setLoader(true);
    setSubmitError(null);
    const { envName, EnvDescription } = preprocessTrimmedFormData(values);
    const coverImage = envCoverImage as File | null;

    if (!coverImage) {
      setSubmitError('Please add a cover image before creating the space.');
      setLoader(false);
      return;
    }

    envService
      .createEnvironment({
        envName: envName as string,
        EnvDescription: EnvDescription as string,
        envCoverImage: coverImage,
      })
      .then((res) => {
        if (res.data.statusCode === 200 && res.data.success === true) {
          payload.onCreated?.();
          reset({ envName: '', EnvDescription: '', envCoverImage: null });
          closeModal();
        }
      })
      .catch((err) =>
        setSubmitError(
          err?.response?.data?.message ||
            'We could not create the space right now.',
        ),
      )
      .finally(() => setLoader(false));
  };

  return (
    <AppModal
      onClose={closeModal}
      contentClassName="max-w-[560px] bg-transparent p-0 text-slate-100 overflow-hidden"
    >
      <div className="surface-subtle max-h-[90vh] overflow-y-auto rounded-[28px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
              Create a space
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-white">
              Give your space a strong first impression
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Add a clear name, a short description, and a polished cover image
              that matches the tone of the community.
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={control}
              name="envName"
              label="Space name"
              placeholder="Name your space"
              maxLength={81}
              disabled={loader}
            />
            <FormTextarea
              control={control}
              name="EnvDescription"
              label="Description"
              placeholder="What is this space about, and who is it for?"
              rows={4}
              maxLength={501}
              disabled={loader}
            />
          </div>

          <div className="rounded-[28px] border border-white/5 bg-[#0c1424] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Cover image
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Upload one image that helps this space feel intentional right
                  away.
                </p>
              </div>
              {loader ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                  <PulseLoader color="#cbd5e1" size={5} aria-label="Loading Spinner" data-testid="loader" />
                  Uploading
                </div>
              ) : null}
            </div>

            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 flex min-h-[240px] w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(11,18,32,0.98))] px-6 text-center transition-all hover:border-cyan-400/50 hover:bg-[#10192d]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                  <ImagePlus className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  Select a cover image
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  This now follows the same preview-first upload style as the
                  cleaner modals in the app.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                  <ImagePlus className="h-4 w-4" />
                  Add image
                </span>
              </button>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="overflow-hidden rounded-[24px] bg-[#09101d]">
                  <div className="relative aspect-[1.35] w-full">
                    <ImageWithFallback
                      className="h-full w-full object-cover"
                      src={previewUrl}
                      alt={envCoverImage?.name || 'Space cover preview'}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020617] via-[#020617]/65 to-transparent p-4">
                      <p className="truncate text-sm font-semibold text-white">
                        {envCoverImage?.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        Cover preview
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => replaceInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition-all hover:bg-white/15"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition-all hover:bg-rose-500/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                handleCoverImageChange(event.target.files);
                event.target.value = '';
              }}
            />
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                handleCoverImageChange(event.target.files);
                event.target.value = '';
              }}
            />
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {submitError}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loader}
              className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loader ? (
                <>
                  <PulseLoader color="#020617" size={6} />
                  Creating
                </>
              ) : (
                'Create space'
              )}
            </button>
          </div>
        </form>
      </div>
    </AppModal>
  );
}
