"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@repo/ui/index";
import { useCreatePostForm, useCreateFeedForm } from "./hook/use-create-new-form.hook";
import { CreatePostValidationType, CreateFeedValidationType } from "./validation/createNew.validation";
import { ModalEntry, useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetFollowedCommunities } from "@/hooks/communityServices/useGetFollowedCommunities";
import { useGetPostById } from "@/hooks/postServices/useGetPostById";
import postService from "@/lib/api/services/postService";
import feedService from "@/lib/api/services/feedService";
import { ToastService } from "@/lib/utilities/toastService";
import { useGifSearch } from "@/hooks/useGifSearch";
import { useQueryClient } from "@tanstack/react-query";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import { POST_CREATION_CONFIG } from "@/lib/config/config";

// Subcomponents
import { MainView } from "./MainView";
import { CreatePostView } from "./post/CreatePostView";
import { CreateFeedView } from "./feed/CreateFeedView";

interface MediaItem {
  id: string;
  type: "photo" | "video" | "gif";
  url: string;
  file?: File;
}

const MUSIC_TRACKS = [
  { id: "1", title: "Corporate Upbeat", artist: "Tech Wave", url: "/music/track1.mp3", cover: "https://picsum.photos/seed/track1/100" },
  { id: "2", title: "Relaxing Lo-Fi", artist: "Chill Vibes", url: "/music/track2.mp3", cover: "https://picsum.photos/seed/track2/100" },
  { id: "3", title: "Adventure Epic", artist: "Cinematic Sounds", url: "/music/track3.mp3", cover: "https://picsum.photos/seed/track3/100" },
  { id: "4", title: "Summer Party", artist: "Beach House", url: "/music/track4.mp3", cover: "https://picsum.photos/seed/track4/100" },
  { id: "5", title: "Tech House", artist: "Cyber Beat", url: "/music/track5.mp3", cover: "https://picsum.photos/seed/track5/100" },
  { id: "6", title: "Acoustic Breeze", artist: "Nature Tones", url: "/music/track6.mp3", cover: "https://picsum.photos/seed/track6/100" },
];

interface CreateNewModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const CreateNewModal = ({ modal, onClose }: CreateNewModalProps) => {
  const { userData } = useAuthStore();
  const { openModal } = useModalStore();
  const {
    gifs,
    setQuery,
    loading: gifsLoading,
    query: gifQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGifSearch();
  const queryClient = useQueryClient();
  const { invalidatePost, invalidateFeed } = useAppInvalidation();
  
  const editMode = (modal.data as any)?.editMode || false;
  const postData = (modal.data as any)?.postData;
  const feedId = (modal.data as any)?.feedId;
  const isFromFeedPage = (modal.data as any)?.isFromFeedPage || false;

  const [currentView, setCurrentView] = useState(editMode || isFromFeedPage ? "post" : "main"); // 'main', 'post', 'feed'
  const [isLoading, setIsLoading] = useState(false);
  
  // Picker States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
 
  // Refs
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraPhotoInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
 
  const { data: postByIdData, isLoading: postByIdLoading } = useGetPostById(
    postData?.id,
    { enabled: editMode && !!postData?.id }
  );

  const initialPostData = useMemo(() => {
    return postByIdData?.data || postData || (feedId ? { feed_id: feedId } : null);
  }, [postByIdData?.data, postData, feedId]);

  // Form Hooks
  const postForm = useCreatePostForm(initialPostData, isFromFeedPage);
  const feedForm = useCreateFeedForm();

  // Media/Music States
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<any | null>(null);
  const [feedAvatar, setFeedAvatar] = useState<{ blob: Blob | null, preview: string }>({ blob: null, preview: "" });
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [musicSearchQuery, setMusicSearchQuery] = useState("");
 
  const { data: followedCommunitiesData } = useGetFollowedCommunities({
    enabled: !!userData?.id,
  });
  const followedCommunities = followedCommunitiesData?.data || [];

  useEffect(() => {
    if (editMode && postByIdData?.data) {
      const post = postByIdData.data;
      
      if (post.media && post.media.length > 0) {
        const existingMedia: MediaItem[] = post.media.map((m: any) => ({
          id: m.id.toString(), // Store as string for consistency in state
          type: m.media_type,
          url: m.media_type === "gif" ? (m.gif_url || m.url) : m.url,
        }));
        setSelectedMedia(existingMedia);
      }
    }
  }, [editMode, postByIdData]);

  const handleOpenPost = () => setCurrentView("post");
  const handleOpenFeed = () => setCurrentView("feed");
  
  const resetForm = () => {
    postForm.reset();
    feedForm.reset();
    setShowEmojiPicker(false);
    setShowGifPicker(false);
    setShowMusicPicker(false);
    setPlayingTrack(null);
    setSelectedMusic(null);
    setMusicSearchQuery("");
    setShowCameraOptions(false);
    setSelectedMedia([]);
    setFeedAvatar({ blob: null, preview: "" });
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  };
 
  const handleBack = () => {
    setCurrentView("main");
    resetForm();
  };
 
  const handleCloseComplete = () => {
    resetForm();
    setCurrentView("main");
    onClose();
  };
 
  const handleCreatePost = async (values: CreatePostValidationType) => {
    setIsLoading(true);
    const payload: any = {
      text_content: values.content || "",
      type: values.type,
      files: selectedMedia
        .filter((media) => media.file)
        .map((media) => media.file as File),
      gif_urls: selectedMedia
        .filter((media) => media.type === "gif")
        .map((media) => media.url),
    };
 
    if (values.communityId) {
      payload.community_id = parseInt(values.communityId);
    }

    if (values.feedId) {
      payload.feed_id = parseInt(values.feedId);
    }
 
    const response: any = await postService.createPost(payload);
 
    if (response?.status === true || response?.status === 201 || response?.status === 200) {
      const postId = response?.data?.data?.id;
      invalidatePost(postId);
      ToastService.success("Post created successfully");
      handleCloseComplete();
    } else {
      ToastService.error(response?.data?.detail || response?.message || "Failed to create post");
    }
    setIsLoading(false);
  };

  const handleUpdatePost = async (values: CreatePostValidationType) => {
    if (!postData?.id) return;
    setIsLoading(true);
    
    try {
      const payload: any = {
        text_content: values.content || "",
        type: values.type,
        files: selectedMedia
          .filter((media) => media.file)
          .map((media) => media.file as File),
        gif_urls: selectedMedia
          .filter((media) => media.type === "gif" && Number.isNaN(Number.parseInt(media.id, 10)))
          .map((media) => media.url),
      };

      if (values.communityId) {
        payload.community_id = parseInt(values.communityId);
      }

      const response: any = await postService.updatePost(postData.id, payload);

      if (response?.status === true || response?.status === 200) {
        invalidatePost(postData.id);
        ToastService.success("Post updated successfully");
        handleCloseComplete();
      } else {
        ToastService.error(response?.message || "Failed to update post content");
      }
    } catch (error: any) {
      ToastService.error(error?.message || "An unexpected error occurred during update");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFeed = async (values: CreateFeedValidationType) => {
    setIsLoading(true);
    const payload: any = {
      title: values.title || "",
      description: values.mainPost || "",
      avatar: feedAvatar.blob || undefined,
    };

    if (values.communityId) {
      payload.community_id = parseInt(values.communityId);
    }

    const response: any = await feedService.createFeed(payload);

    if (response?.status === true || response?.status === "success" || response?.status === 201 || response?.status === 200) {
      invalidateFeed();
      const feedId = response?.data?.id || response?.id;
      if (feedId) {
        const mediaFiles = selectedMedia.filter(m => m.file);
        if (mediaFiles.length > 0) {
          try {
            for (const media of mediaFiles) {
              if (media.file) {
                await feedService.uploadFeedMedia(feedId, media.file);
              }
            }
            invalidateFeed();
            ToastService.success("Feed and media uploaded successfully");
          } catch (uploadError: any) {
            ToastService.warning("Feed created, but some media failed to upload");
          }
        } 

        if (mediaFiles.length === 0) {
          ToastService.success("Feed created successfully");
        }
      } else {
        ToastService.success("Feed created successfully");
      }
      handleCloseComplete();
    } else {
      ToastService.error(response?.message || "Failed to create feed");
    }
    setIsLoading(false);
  };

  const onEmojiClick = (emojiData: any) => {
    if (currentView === "post") {
      postForm.setValue("content", (postForm.getValues("content") || "") + emojiData.emoji);
    } else if (currentView === "feed") {
      feedForm.setValue("mainPost", (feedForm.getValues("mainPost") || "") + emojiData.emoji);
    }
  };

  const onGifClick = (gif: any) => {
    const gifUrl = gif.original?.url || gif.downsized?.url || gif.preview?.url;
    if (!gifUrl) {
      ToastService.error("Unable to attach GIF");
      return;
    }

    const gifItem: MediaItem = {
      id: gif.id,
      type: "gif",
      url: gifUrl,
    };
    // Replace any existing GIF — only one allowed
    setSelectedMedia((prev) => [
      ...prev.filter((m) => m.type !== "gif"),
      gifItem,
    ]);
    postForm.setValue("type", "photo");
    setShowGifPicker(false);
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check against config limit
    const currentMediaCount = selectedMedia.length;
    const availableSlots = Math.max(0, POST_CREATION_CONFIG.MAX_MEDIA_ATTACHMENTS - currentMediaCount);

    if (availableSlots === 0) {
      ToastService.error(`You can only attach up to ${POST_CREATION_CONFIG.MAX_MEDIA_ATTACHMENTS} media items.`);
      e.target.value = "";
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);

    if (files.length > availableSlots) {
      ToastService.warning(`Added ${availableSlots} items. Maximum limit is ${POST_CREATION_CONFIG.MAX_MEDIA_ATTACHMENTS}.`);
    }

    const newMediaItems: MediaItem[] = filesToProcess.map((file) => {
      const type = file.type.startsWith("video") ? "video" : "photo";
      return {
        id: Math.random().toString(36).substring(7),
        type,
        file,
        url: URL.createObjectURL(file),
      };
    });

    setSelectedMedia((prev) => [...prev, ...newMediaItems]);
    
    if (newMediaItems.length > 0 && newMediaItems[0]) {
      const type = newMediaItems[0].type;
      postForm.setValue("type", type === "gif" ? "photo" : type);
    }
    e.target.value = "";
  };

  const removeMedia = (id: string) => {
    const removeMediaFromState = () => {
      setSelectedMedia((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        if (filtered.length === 0) {
          postForm.setValue("type", "text");
        }
        return filtered;
      });
    };

    if (!editMode) {
      removeMediaFromState();
      return;
    }

    openModal("confirmation", {
      title: "Delete Media?",
      description: "This media will be removed from the post.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        const mediaId = Number.parseInt(id, 10);

        if (!Number.isNaN(mediaId) && postData?.id) {
          const response: any = await postService.deletePostMedia(postData.id, mediaId);

          if (response?.status === true || response?.status === 200) {
            removeMediaFromState();
            invalidatePost(postData.id);
            ToastService.success("Media deleted successfully");
            return;
          }

          throw new Error(response?.message || "Failed to delete media");
        }

        removeMediaFromState();
      },
    });
  };

  const handleMusicPlay = (track: any) => {
    if (playingTrack === track.id) {
      audioRef.current?.pause();
      setPlayingTrack(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(console.error);
      }
      setPlayingTrack(track.id);
    }
  };

  const handleMusicSelect = (track: any) => {
    setSelectedMusic(track);
    setShowMusicPicker(false);
    audioRef.current?.pause();
    setPlayingTrack(null);
  };

  const removeMusic = () => {
    setSelectedMusic(null);
    audioRef.current?.pause();
    setPlayingTrack(null);
  };

  return (
    <Dialog open={true} onOpenChange={handleCloseComplete}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 border-none bg-transparent">
        <DialogTitle className="sr-only">Create New</DialogTitle>
        
        {currentView === "main" && (
          <MainView onOpenPost={handleOpenPost} onOpenFeed={handleOpenFeed} />
        )}

        {currentView === "post" && (
          <CreatePostView 
            onBack={handleBack}
            isLoading={isLoading || (editMode && postByIdLoading)}
            user={userData}
            followedCommunities={followedCommunities}
            postForm={postForm}
            onSubmit={editMode ? handleUpdatePost : handleCreatePost}
            isEdit={editMode}
            selectedMedia={selectedMedia}
            removeMedia={removeMedia}
            selectedMusic={selectedMusic}
            removeMusic={removeMusic}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={onEmojiClick}
            showGifPicker={showGifPicker}
            setShowGifPicker={setShowGifPicker}
            gifQuery={gifQuery}
            setGifQuery={setQuery}
            gifs={gifs}
            gifsLoading={gifsLoading}
            onGifClick={onGifClick}
            onGifLoadMore={fetchNextPage}
            hasMoreGifs={!!hasNextPage}
            isFetchingNextGifs={isFetchingNextPage}
            showMusicPicker={showMusicPicker}
            setShowMusicPicker={setShowMusicPicker}
            playingTrackId={playingTrack}
            handlePlayToggle={handleMusicPlay}
            musicSearchQuery={musicSearchQuery}
            setMusicSearchQuery={setMusicSearchQuery}
            musicTracks={MUSIC_TRACKS.filter(t => 
              t.title.toLowerCase().includes(musicSearchQuery.toLowerCase()) ||
              t.artist.toLowerCase().includes(musicSearchQuery.toLowerCase())
            )}
            onSelectMusic={handleMusicSelect}
            audioRef={audioRef}
            handleAudioEnded={() => setPlayingTrack(null)}
            showCameraOptions={showCameraOptions}
            setShowCameraOptions={setShowCameraOptions}
            galleryInputRef={galleryInputRef}
            cameraPhotoInputRef={cameraPhotoInputRef}
            cameraVideoInputRef={cameraVideoInputRef}
            isGifDisabled={false}
            isMusicDisabled={editMode}
            hideMediaActions={false}
            isFromFeedPage={isFromFeedPage}
          />
        )}

        {currentView === "feed" && (
          <CreateFeedView 
            onBack={handleBack}
            isLoading={isLoading}
            user={userData}
            followedCommunities={followedCommunities}
            feedForm={feedForm}
            onSubmit={handleCreateFeed}
            selectedMedia={selectedMedia}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={onEmojiClick}
            feedAvatar={feedAvatar}
            setFeedAvatar={setFeedAvatar}
            openModal={openModal}
          />
        )}

        {/* Hidden File Inputs */}
        <input type="file" ref={galleryInputRef} className="hidden" accept="image/*,video/*" multiple onChange={handleMediaSelect} />
        <input type="file" ref={cameraPhotoInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleMediaSelect} />
        <input type="file" ref={cameraVideoInputRef} className="hidden" accept="video/*" capture="environment" onChange={handleMediaSelect} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewModal;
