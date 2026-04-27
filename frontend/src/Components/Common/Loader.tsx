import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-[#090e1a]">
      <ClipLoader color="#6366f1" size={50} />
    </div>
  );
}
