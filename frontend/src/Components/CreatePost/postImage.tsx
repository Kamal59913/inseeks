import React from 'react';
import ImagePostComposerModal from './ImagePostComposerModal';

interface PostImagesProps {
  modalId: string;
  data?: {
    envname?: string;
    updatepost?: (post: any) => void;
  };
}

export function PostImages({ modalId, data }: PostImagesProps) {
  return <ImagePostComposerModal modalId={modalId} data={data} />;
}
