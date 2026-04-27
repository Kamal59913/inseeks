import React from 'react';
import QuestionComposerModal from './QuestionComposerModal';

interface PostVideoProps {
  modalId: string;
  data?: { envname?: string; updatepost?: (post: any) => void };
}

export function PostVideo({ modalId, data }: PostVideoProps) {
  return <QuestionComposerModal modalId={modalId} data={{ ...data, preset: 'video' }} />;
}
