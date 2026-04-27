import React from "react";
import { useModalData } from "../../store/hooks";

interface SharePostProps {
  avatar?: string;
  modalData?: any;
}

import ImageWithFallback from '../Common/ImageWithFallback';

export default function SharePost({ avatar, modalData }: SharePostProps) {
  const modal = useModalData();

  return (
    <div className="w-full rounded-2xl bg-[#111827] p-4 transition-all duration-200 ">
      <div className="flex items-center gap-3">
        <ImageWithFallback
          variant="avatar"
          className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2a3d5c] shrink-0"
          src={avatar}
          alt="avatar"
        />
        <button
          type="button"
          onClick={() => modal.open("post-anything", modalData)}
          className="flex-1 rounded-xl bg-[#1a2540] px-4 py-2.5 text-left text-sm text-slate-500 transition-all duration-200 hover:bg-[#1e2d4a] hover:text-slate-300"
        >
          Ask a question or share an update
        </button>
      </div>
    </div>
  );
}
