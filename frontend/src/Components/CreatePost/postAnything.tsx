import React from 'react';
import QuestionComposerModal from './QuestionComposerModal';

interface PostAnyThingProps {
  modalId: string;
  data?: {
    envname?: string;
    updatepost?: (post: any) => void;
  };
}

export function PostAnyThing({ modalId, data }: PostAnyThingProps) {
  return <QuestionComposerModal modalId={modalId} data={{ ...data, preset: 'any' }} />;
}
