import React from 'react';
import QuestionComposerModal from './QuestionComposerModal';

interface PostImagesProps {
  modalId: string;
  data?: {
    envname?: string;
    updatepost?: (post: any) => void;
  };
}

export function PostImages({ modalId, data }: PostImagesProps) {
  return <QuestionComposerModal modalId={modalId} data={{ ...data, preset: 'image' }} />;
}
