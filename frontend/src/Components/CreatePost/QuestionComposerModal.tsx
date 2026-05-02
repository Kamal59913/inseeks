import React, { useEffect, useMemo, useState } from "react";
import { useController } from "react-hook-form";
import PulseLoader from "react-spinners/PulseLoader";
import AppModal from "../Modal/AppModal";
import { useAppForm } from "../../hooks/useAppForm";
import { postQuestionSchema } from "../../validations/schemas/post.schema";
import { preprocessTrimmedFormData } from "../../utils/formValidation";
import { FormField, FormTextarea } from "../Common/FormFields";
import { useModalData } from "../../store/hooks";
import { postService } from "../../services/post.service";
import ImageWithFallback from "../Common/ImageWithFallback";
import { useEnvironmentQuery } from "../../hooks/useEnvironmentQuery";
import InfiniteLoader from "../Common/InfiniteLoader";

interface QuestionComposerModalProps {
  modalId: string;
  data?: {
    envname?: string;
    updatepost?: (post: any) => void;
  };
}

const detectPreviewKind = (file: File) => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "application/pdf") return "pdf";
  return "file";
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function QuestionComposerModal({
  modalId,
  data,
}: QuestionComposerModalProps) {
  const modal = useModalData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const payload = data || {};
  const [spaceMenuOpen, setSpaceMenuOpen] = useState(false);
  const {
    data: spaces,
    fetchNextPage: fetchNextSpaces,
    hasNextPage: hasNextSpaces,
    isFetchingNextPage: isFetchingNextSpaces,
  } = useEnvironmentQuery();

  const { control, handleSubmit, reset } = useAppForm({
    schema: postQuestionSchema,
    defaultValues: {
      envname: payload.envname || "",
      title: "",
      description: "",
      attachments: [] as File[],
    },
  });

  const { field: attachmentsField, fieldState: attachmentsState } =
    useController({
      control,
      name: "attachments",
    });
  const { field: spaceField, fieldState: spaceState } = useController({
    control,
    name: "envname",
  });

  const attachments = (attachmentsField.value || []) as File[];
  const selectedSpace =
    spaces?.items?.find((space: any) => space.name === spaceField.value) ||
    null;
  const selectedSpaceLabel = selectedSpace?.name || spaceField.value || "";

  const previews = useMemo(
    () =>
      attachments.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        kind: detectPreviewKind(file),
      })),
    [attachments],
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews],
  );

  const closeModal = () => {
    if (modalId) return modal.closeById(modalId);
    modal.close();
  };

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    attachmentsField.onChange([...attachments, ...Array.from(files)]);
  };

  const removeAttachment = (indexToRemove: number) => {
    attachmentsField.onChange(
      attachments.filter((_: File, index: number) => index !== indexToRemove),
    );
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const {
        envname,
        title,
        description,
        attachments: selectedAttachments,
      } = preprocessTrimmedFormData(values);
      const response = await postService.createQuestionPost({
        envname: (envname as string) || "",
        title: (title as string) || "",
        description: description as string,
        attachments: (selectedAttachments as File[]) || [],
      });

      payload.updatepost?.(response.data.data);
      reset({
        envname: payload.envname || "",
        title: "",
        description: "",
        attachments: [],
      });
      closeModal();
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ||
          "We could not publish the question right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      onClose={closeModal}
      contentClassName="max-w-2xl bg-[#0b1220] p-0 text-slate-100 overflow-hidden"
    >
      <div className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
              Ask in a space
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Create a clear, reviewable question post
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Write your question, add context, and attach screenshots, videos,
              audio, PDFs, or other supporting files.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Space
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSpaceMenuOpen((previous) => !previous)}
                  className={`flex w-full items-center justify-between rounded-xl field-subtle px-4 py-3 text-left text-sm transition-all duration-200 focus:outline-none ${
                    spaceState.error ? "border border-red-500/70" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p
                      className={`${selectedSpaceLabel ? "text-slate-100" : "text-slate-500"} truncate`}
                    >
                      {selectedSpaceLabel || "Select a space"}
                    </p>
                    {selectedSpace?.description ? (
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {selectedSpace.description}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-slate-500">
                        Choosing a space is required before publishing.
                      </p>
                    )}
                  </div>
                  <i
                    className={`fa-solid fa-chevron-down text-xs text-slate-500 transition-transform ${
                      spaceMenuOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {spaceMenuOpen ? (
                  <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl field-subtle p-2 shadow-2xl">
                    {spaces?.items?.length ? (
                      <>
                        {spaces.items.map((space: any) => (
                          <button
                            key={space._id}
                            type="button"
                            onClick={() => {
                              spaceField.onChange(space.name);
                              setSpaceMenuOpen(false);
                            }}
                            className={`w-full rounded-xl px-3 py-3 text-left transition-all hover:bg-[#16213a] ${
                              spaceField.value === space.name
                                ? "bg-[#16213a]"
                                : ""
                            }`}
                          >
                            <p className="truncate text-sm font-semibold text-slate-100">
                              {space.name}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                              {space.description}
                            </p>
                          </button>
                        ))}
                        <InfiniteLoader
                          onLoadMore={fetchNextSpaces}
                          hasMore={hasNextSpaces}
                          isLoading={isFetchingNextSpaces}
                          label="Loading more spaces..."
                        />
                      </>
                    ) : (
                      <div className="px-3 py-4 text-sm text-slate-500">
                        No spaces available yet.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              {spaceState.error ? (
                <p className="text-xs text-red-400">
                  {spaceState.error.message}
                </p>
              ) : null}
            </div>

            <FormField
              control={control}
              name="title"
              label="Question title"
              placeholder="What do you need help with?"
              maxLength={121}
              disabled={isSubmitting}
            />
            <FormTextarea
              control={control}
              name="description"
              label="Context"
              placeholder="Describe the problem, expected result, and what you've already tried."
              rows={6}
              maxLength={501}
              disabled={isSubmitting}
            />
          </div>

          <div className="rounded-2xl bg-[#0f172a] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Attachments
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Add optional files to support your question.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500">
                <i className="fa-solid fa-paperclip text-xs"></i>
                Attach files
                <input
                  type="file"
                  className="hidden"
                  multiple
                  disabled={isSubmitting}
                  onChange={(event) => {
                    addFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Images, videos, audio, PDFs, and other files are supported.
            </p>

            {attachmentsState.error ? (
              <p className="mt-3 text-xs text-red-400">
                {attachmentsState.error.message}
              </p>
            ) : null}

            {previews.length ? (
              <div className="mt-4 grid gap-3">
                {previews.map((preview, index) => (
                  <div
                    key={`${preview.file.name}-${index}`}
                    className="rounded-2xl bg-[#111827] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-100">
                          {preview.file.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {preview.file.type || "Unknown file type"} -{" "}
                          {formatBytes(preview.file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="rounded-lg p-2 text-slate-500 transition-all hover:bg-[#1a2540] hover:text-rose-300"
                        aria-label={`Remove ${preview.file.name}`}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    {preview.kind === "image" ? (
                      <ImageWithFallback
                        src={preview.url}
                        alt={preview.file.name}
                        className="mt-3 h-40 w-full rounded-xl object-cover"
                      />
                    ) : null}

                    {preview.kind === "video" ? (
                      <video
                        src={preview.url}
                        controls
                        className="mt-3 h-40 w-full rounded-xl bg-black"
                      />
                    ) : null}

                    {preview.kind === "audio" ? (
                      <audio
                        src={preview.url}
                        controls
                        className="mt-3 w-full"
                      />
                    ) : null}

                    {preview.kind === "pdf" ? (
                      <iframe
                        src={preview.url}
                        title={preview.file.name}
                        className="mt-3 h-48 w-full rounded-xl bg-white"
                      />
                    ) : null}

                    {preview.kind === "file" ? (
                      <div className="mt-3 rounded-xl bg-[#0f172a] px-4 py-3 text-sm text-slate-300">
                        This file will be attached and available in the question
                        detail view.
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-[#0b1220] px-4 py-6 text-center text-sm text-slate-500">
                No files attached yet.
              </div>
            )}
          </div>

          {submitError ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {submitError}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <PulseLoader color="#020617" size={6} />
                  Publishing
                </>
              ) : (
                "Publish question"
              )}
            </button>
          </div>
        </form>
      </div>
    </AppModal>
  );
}
