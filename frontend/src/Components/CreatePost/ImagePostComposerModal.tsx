import React, { useEffect, useMemo, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { Camera, ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import PulseLoader from "react-spinners/PulseLoader";
import AppModal from "../Modal/AppModal";
import { useAppForm } from "../../hooks/useAppForm";
import { imagePostSchema } from "../../validations/schemas/post.schema";
import { preprocessTrimmedFormData } from "../../utils/formValidation";
import { FormField } from "../Common/FormFields";
import { useModalData } from "../../store/hooks";
import { postService } from "../../services/post.service";
import ImageWithFallback from "../Common/ImageWithFallback";
import { useEnvironmentQuery } from "../../hooks/useEnvironmentQuery";
import InfiniteLoader from "../Common/InfiniteLoader";

interface ImagePostComposerModalProps {
  modalId: string;
  data?: {
    envname?: string;
    updatepost?: (post: any) => void;
  };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ImagePostComposerModal({
  modalId,
  data,
}: ImagePostComposerModalProps) {
  const modal = useModalData();
  const payload = data || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [spaceMenuOpen, setSpaceMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: spaces,
    fetchNextPage: fetchNextSpaces,
    hasNextPage: hasNextSpaces,
    isFetchingNextPage: isFetchingNextSpaces,
  } = useEnvironmentQuery();

  const { control, handleSubmit, reset } = useAppForm({
    schema: imagePostSchema,
    defaultValues: {
      envname: payload.envname || "",
      title: "",
      images: [] as File[],
    },
  });

  const { field: imagesField, fieldState: imagesState } = useController({
    control,
    name: "images",
  });
  const { field: spaceField, fieldState: spaceState } = useController({
    control,
    name: "envname",
  });

  const images = (imagesField.value || []) as File[];
  const selectedImage = images[selectedIndex] || null;
  const selectedSpace =
    spaces?.items?.find((space: any) => space.name === spaceField.value) ||
    null;
  const selectedSpaceLabel = selectedSpace?.name || spaceField.value || "";

  const previews = useMemo(
    () =>
      images.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [images],
  );

  useEffect(() => {
    if (!images.length) {
      setSelectedIndex(0);
      return;
    }

    if (selectedIndex > images.length - 1) {
      setSelectedIndex(images.length - 1);
    }
  }, [images.length, selectedIndex]);

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews],
  );

  const closeModal = () => {
    if (modalId) {
      modal.closeById(modalId);
      return;
    }
    modal.close();
  };

  const setImages = (nextImages: File[]) => {
    imagesField.onChange(nextImages);
  };

  const buildFileError = (files: File[]) => {
    if (files.some((file) => !file.type.startsWith("image/"))) {
      return "Only image files are supported.";
    }

    const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      return `${oversized.name} is larger than 5 MB.`;
    }

    if (images.length + files.length > 8) {
      return "You can upload up to 8 images in one post.";
    }

    return null;
  };

  const addImages = (files: FileList | null) => {
    if (!files?.length) return;

    const nextFiles = Array.from(files);
    const fileError = buildFileError(nextFiles);

    if (fileError) {
      setSubmitError(fileError);
      return;
    }

    setSubmitError(null);
    const uniqueFiles = nextFiles.filter(
      (file) =>
        !images.some((img) => img.name === file.name && img.size === file.size),
    );

    if (uniqueFiles.length > 0) {
      const updatedImages = [...images, ...uniqueFiles];
      setImages(updatedImages);
    }

    if (!images.length) {
      setSelectedIndex(0);
    }
  };

  const replaceSelectedImage = (files: FileList | null) => {
    if (!files?.length || selectedIndex < 0 || !images.length) return;

    const nextFile = files[0];
    const fileError = buildFileError([nextFile]);

    if (fileError) {
      setSubmitError(fileError);
      return;
    }

    setSubmitError(null);
    const nextImages = [...images];
    nextImages[selectedIndex] = nextFile;
    setImages(nextImages);
  };

  const removeSelectedImage = () => {
    if (!images.length) return;

    const nextImages = images.filter((_, index) => index !== selectedIndex);
    setImages(nextImages);
    setSubmitError(null);
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const {
        envname,
        title,
        images: selectedImages,
      } = preprocessTrimmedFormData(values);
      const response = await postService.createImagePost({
        envname: (envname as string) || "",
        title: (title as string) || "",
        images: (selectedImages as File[]) || [],
      });

      payload.updatepost?.(response.data.data);
      reset({
        envname: payload.envname || "",
        title: "",
        images: [],
      });
      closeModal();
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ||
          "We could not publish the image post right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      onClose={closeModal}
      contentClassName="max-w-3xl bg-transparent p-0 text-slate-100 overflow-hidden"
    >
      <div className="surface-subtle max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
              Image post
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Share a polished visual update
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Add a strong title, choose the right space, and upload images with
              a clean preview-first flow.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="ml-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Space
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSpaceMenuOpen((previous) => !previous)}
                    className={`field-subtle flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-left text-sm transition-all duration-200 ${
                      spaceState.error
                        ? "ring-1 ring-red-500/50"
                        : "hover:bg-[#1b2742]"
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`truncate ${
                          selectedSpaceLabel
                            ? "text-slate-100"
                            : "text-slate-500"
                        }`}
                      >
                        {selectedSpaceLabel || "Select a space"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {selectedSpace?.description ||
                          "Choose where this image post should appear."}
                      </p>
                    </div>
                    <i
                      className={`fa-solid fa-chevron-down text-xs text-slate-500 transition-transform ${
                        spaceMenuOpen ? "rotate-180" : ""
                      }`}
                    ></i>
                  </button>

                  {spaceMenuOpen ? (
                    <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#1f2e47] bg-[#0f172a] p-2 shadow-2xl">
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
                              className={`w-full rounded-2xl px-4 py-3 text-left transition-all hover:bg-[#16213a] ${
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
                  <p className="ml-2 text-[11px] font-semibold text-red-400">
                    {spaceState.error.message}
                  </p>
                ) : null}
              </div>

              <FormField
                control={control}
                name="title"
                label="Post title"
                placeholder="Give people enough context before they open the gallery"
                maxLength={121}
                disabled={isSubmitting}
              />

              <div className="rounded-[28px] border border-white/5 bg-[#0c1424] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Upload notes
                </p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <p>
                    Use clear images with good lighting for the best
                    presentation.
                  </p>
                  <p>
                    Each image can be up to 5 MB, with a maximum of 8 images.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {!previews.length ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex aspect-[0.95] w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(11,18,32,0.98))] px-6 text-center transition-all hover:border-cyan-400/50 hover:bg-[#10192d] ${
                    imagesState.error ? "border-red-500/60" : "border-white/10"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                    <Camera className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    Select images to get started
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                    This follows the same clean upload rhythm as the sample:
                    choose, preview, refine, then publish.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                    <ImagePlus className="h-4 w-4" />
                    Add images
                  </span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-[28px] bg-[#09101d]">
                    <div className="relative aspect-[0.95] w-full">
                      <ImageWithFallback
                        src={previews[selectedIndex].url}
                        alt={selectedImage?.name || "Selected image"}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020617] via-[#020617]/65 to-transparent p-4">
                        <p className="truncate text-sm font-semibold text-white">
                          {selectedImage?.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-300">
                          {formatBytes(selectedImage?.size || 0)}
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
                      Replace selected
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300"
                    >
                      <ImagePlus className="h-4 w-4" />
                      Add more
                    </button>
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition-all hover:bg-rose-500/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                    {previews.map((preview, index) => (
                      <button
                        key={`${preview.file.name}-${index}`}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={`overflow-hidden rounded-2xl border transition-all ${
                          selectedIndex === index
                            ? "border-cyan-300 shadow-[0_0_0_1px_rgba(103,232,249,0.35)]"
                            : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <ImageWithFallback
                          src={preview.url}
                          alt={preview.file.name}
                          className="aspect-square w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  addImages(event.target.files);
                  event.target.value = "";
                }}
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  replaceSelectedImage(event.target.files);
                  event.target.value = "";
                }}
              />

              {imagesState.error ? (
                <p className="text-[11px] font-semibold text-red-400">
                  {imagesState.error.message}
                </p>
              ) : null}
            </div>
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
              disabled={isSubmitting}
              className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <PulseLoader color="#020617" size={6} />
                  Publishing
                </>
              ) : (
                "Publish image post"
              )}
            </button>
          </div>
        </form>
      </div>
    </AppModal>
  );
}
