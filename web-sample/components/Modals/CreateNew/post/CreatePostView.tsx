"use client";
import React, { useRef } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  SingleSelectDropdown,
  Form,
  FormField,
  FormItem,
  Field,
  FieldError,
  FieldGroup,
  InputGroupTextarea,
} from "@repo/ui/index";
import { UseFormReturn } from "react-hook-form";
import { CreatePostValidationType } from "../validation/createNew.validation";
import { ActionButtons } from "../utils/ActionButtons";
import { MediaPreview } from "../utils/MediaPreview";
import { GifPicker } from "../utils/GifPicker";
import { MusicPicker } from "../utils/MusicPicker";
import { useClickOutside } from "../../../../hooks/utils/useClickOutside";
import { ComposerLinkPreview } from "@/components/ui/composer-link-preview";

interface CreatePostViewProps {
  onBack: () => void;
  isLoading: boolean;
  user: any;
  followedCommunities: any[];
  postForm: UseFormReturn<CreatePostValidationType>;
  onSubmit: (values: CreatePostValidationType) => Promise<void>;

  // Media State
  selectedMedia: any[];
  removeMedia: (id: string) => void;
  selectedMusic: any | null;
  removeMusic: () => void;

  // Pickers State
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  onEmojiClick: (emojiData: any) => void;

  showGifPicker: boolean;
  setShowGifPicker: (show: boolean) => void;
  gifQuery: string;
  setGifQuery: (query: string) => void;
  gifs: any[];
  gifsLoading: boolean;
  onGifClick: (gif: any) => void;
  onGifLoadMore: () => void;
  hasMoreGifs: boolean;
  isFetchingNextGifs: boolean;

  showMusicPicker: boolean;
  setShowMusicPicker: (show: boolean) => void;
  playingTrackId: string | null;
  handlePlayToggle: (track: any) => void;
  musicSearchQuery: string;
  setMusicSearchQuery: (query: string) => void;
  musicTracks: any[];
  onSelectMusic: (track: any) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  handleAudioEnded: () => void;

  // Camera State
  showCameraOptions: boolean;
  setShowCameraOptions: (show: boolean) => void;
  galleryInputRef: React.RefObject<HTMLInputElement | null>;
  cameraPhotoInputRef: React.RefObject<HTMLInputElement | null>;
  cameraVideoInputRef: React.RefObject<HTMLInputElement | null>;
  isEdit?: boolean;
  isFromFeedPage?: boolean;
  isGifDisabled?: boolean;
  isMusicDisabled?: boolean;
  hideMediaActions?: boolean;
}

export const CreatePostView = ({
  onBack,
  isLoading,
  user,
  followedCommunities,
  postForm,
  onSubmit,
  selectedMedia,
  removeMedia,
  selectedMusic,
  removeMusic,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  showGifPicker,
  setShowGifPicker,
  gifQuery,
  setGifQuery,
  gifs,
  gifsLoading,
  onGifClick,
  onGifLoadMore,
  hasMoreGifs,
  isFetchingNextGifs,
  showMusicPicker,
  setShowMusicPicker,
  playingTrackId,
  handlePlayToggle,
  musicSearchQuery,
  setMusicSearchQuery,
  musicTracks,
  onSelectMusic,
  audioRef,
  handleAudioEnded,
  showCameraOptions,
  setShowCameraOptions,
  galleryInputRef,
  cameraPhotoInputRef,
  cameraVideoInputRef,
  isEdit = false,
  isFromFeedPage = false,
  isGifDisabled = true,
  isMusicDisabled = true,
  hideMediaActions = false,
}: CreatePostViewProps) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useClickOutside(emojiPickerRef, () => {
    setShowEmojiPicker(false);
  }, showEmojiPicker);

  const watchedValues = postForm.watch();
  const isFormEmpty = 
    !watchedValues.content?.trim() && 
    selectedMedia.length === 0;
  const hasSelectedGif = selectedMedia.some((m) => m.type === "gif");
  const composerText = watchedValues.content || "";
  return (
    <div className="flex flex-col h-[600px] p-4 bg-white rounded-md relative shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-0 border-b border-gray-200 pb-2">
        {!isEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
        )}
        <h2 className="text-lg font-medium text-gray-800 flex-1 px-2">
          {isEdit ? "Edit Post" : "Post"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex items-center gap-3 mb-4 mx-1">
          <Avatar>
            <AvatarImage src={user?.profile_photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
              {user?.full_name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-800">
            {user?.full_name || "User"}
          </span>
        </div>

        <Form {...postForm}>
          <form
            id="post-form"
            onSubmit={postForm.handleSubmit(onSubmit as any)}
          >
            <FieldGroup className="space-y-4 mx-1">
              {!isEdit && !isFromFeedPage && (
                <FormField
                  control={postForm.control as any}
                  name="communityId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Field data-invalid={fieldState.invalid}>
                        <SingleSelectDropdown
                          options={followedCommunities.map((c: any) => ({
                            value: c.id.toString(),
                            label: c.name,
                            image: c.profile_photo_url,
                          }))}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select a community"
                          title="Community (Optional)"
                          showSearch={true}
                          showEllipsis={false}
                          errorMessage={fieldState.error?.message}
                          placeholderClassName="text-muted-foreground font-normal"
                          notFoundText={
                            followedCommunities.length === 0
                              ? "You haven't followed any communities yet."
                              : "No communities match your search."
                          }
                        />
                      </Field>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={postForm.control as any}
                name="content"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Field data-invalid={fieldState.invalid}>
                      <InputGroupTextarea
                        {...field}
                        placeholder="Main Post (Optional)"
                        className="min-h-[120px] bg-white border-gray-200 shadow-none"
                        allowEmptySpaces={true}
                        autoResize={true}
                        stretchable={true}
                        showEllipsis={false}
                        maxLength={2001}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FormItem>
                )}
              />
            </FieldGroup>
          </form>
        </Form>

        <div className="mx-1 mt-4">
          <ComposerLinkPreview text={composerText} />
        </div>

        <MediaPreview
          selectedMedia={selectedMedia}
          removeMedia={removeMedia}
          selectedMusic={selectedMusic}
          removeMusic={removeMusic}
        />

        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 z-50 shadow-2xl rounded-xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.LIGHT}
              width={350}
              height={400}
            />
          </div>
        )}

        {showGifPicker && (
          <GifPicker
            onClose={() => setShowGifPicker(false)}
            gifQuery={gifQuery}
            setQuery={setGifQuery}
            gifs={gifs}
            gifsLoading={gifsLoading}
            onGifClick={onGifClick}
            onLoadMore={onGifLoadMore}
            hasMore={hasMoreGifs}
            isFetchingNextPage={isFetchingNextGifs}
          />
        )}

        {showMusicPicker && (
          <MusicPicker
            onClose={() => setShowMusicPicker(false)}
            tracks={musicTracks}
            onSelect={onSelectMusic}
            selectedTrackId={selectedMusic?.id}
            playingTrackId={playingTrackId}
            onPlayToggle={handlePlayToggle}
            searchQuery={musicSearchQuery}
            onSearchChange={setMusicSearchQuery}
            audioRef={audioRef}
            onAudioEnded={handleAudioEnded}
          />
        )}
      </div>

      <div className="py-4 border-t border-gray-200">
        <ActionButtons
          showCameraOptions={showCameraOptions}
          setShowCameraOptions={setShowCameraOptions}
          galleryInputRef={galleryInputRef}
          cameraPhotoInputRef={cameraPhotoInputRef}
          cameraVideoInputRef={cameraVideoInputRef}
          setShowGifPicker={setShowGifPicker}
          showGifPicker={showGifPicker}
          setShowMusicPicker={setShowMusicPicker}
          showMusicPicker={showMusicPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          showEmojiPicker={showEmojiPicker}
          isGifDisabled={isGifDisabled}
          isMusicDisabled={isMusicDisabled}
          hideMediaActions={hideMediaActions}
          hasSelectedGif={hasSelectedGif}
        />

        <Button
          form="post-form"
          type="submit"
          className="w-full h-11"
          disabled={isLoading || isFormEmpty}
          loadingState={isLoading}
        >
          {isEdit ? "Update" : "Post"}
        </Button>
      </div>
    </div>
  );
};
