import React from 'react';
import RIGHTCOMMENTBAR from '../Utilities/RightSideCommentBar';
import { useModalData } from '../../store/hooks';
import AppModal from '../Modal/AppModal';

interface VideoPostProps {
  modalId: string;
  data?: {
    temp?: any;
  };
}

export default function VideoPost({ modalId, data }: VideoPostProps) {
  const modal = useModalData();
  const temp = data?.temp || {};
  const summaryParts = [temp.title, temp.description].filter(Boolean);
  const summaryText = summaryParts.join(' - ');

  return (
    <AppModal
      onClose={() => modal.closeById(modalId)}
      contentClassName="h-[90vh] w-[92vw] max-w-3xl overflow-hidden rounded-2xl bg-[#111827]"
      outsideClick={true}
    >
      <RIGHTCOMMENTBAR
        currentUser={temp.currentUser}
        currentPostId={temp.postId}
        summaryText={summaryText}
      />
    </AppModal>
  );
}
