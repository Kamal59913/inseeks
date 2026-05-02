import { ChangeEvent, useState } from "react";
import ReferenceImageModal from "../../../ui/modals/ReferenceImageModal";
import Button from "@/components/ui/button/Button";

interface DetailsStepProps {
  notes: string;
  setNotes: (notes: string) => void;
  imagePreviews: (string | null)[];
  handleFileChange: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  goNext: () => void;
  isUploading: boolean[];
}

export default function DetailsStep({
  notes,
  setNotes,
  imagePreviews,
  handleFileChange,
  removeImage,
  goNext,
  isUploading,
}: DetailsStepProps) {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleImageClick = (idx: number) => {
    // Find the correct index in the filtered array
    const filteredImgs = imagePreviews.filter(
      (img: string | null) => img !== null,
    );
    const clickedImg = imagePreviews[idx];
    if (!clickedImg) return;

    const newIndex = filteredImgs.indexOf(clickedImg);

    if (newIndex !== -1) {
      setSelectedPhotoIndex(newIndex);
      setIsPhotoModalOpen(true);
    }
  };

  return (
    <div>
      <label className="block mt-4 text-sm font-medium text-white">
        Special instructions (optional)
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
        className="mt-2 w-full text-xs rounded-lg p-3 bg-[#1a0a1a] min-h-[110px] border border-white/5"
      />

      <label className="block mt-4 text-sm font-medium text-white mb-4">
        Image references (optional)
      </label>
      <div className="flex gap-3">
        {imagePreviews.map((img: string | null, idx: number) => (
          <div
            key={idx}
            className=" h-34 rounded-lg bg-[#1a0a1a] flex items-center justify-center relative border border-white/8 w-1/3"
          >
            {isUploading && isUploading[idx] ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : img ? (
              <>
                <img
                  src={img}
                  alt={`ref-${idx}`}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                  onClick={() => handleImageClick(idx)}
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-white text-black rounded-full w-7 h-7 cursor-pointer z-10"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <div className="text-purple-300 text-2xl">📷</div>
                <label className="absolute bottom-2 right-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFileChange(idx, e)
                    }
                    className="hidden"
                  />
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center cursor-pointer">
                    +
                  </div>
                </label>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button
          onClick={goNext}
          variant="white"
          size="none"
          borderRadius="rounded-lg"
          className="w-full py-3 text-sm font-bold"
        >
          Continue
        </Button>
      </div>

      {isPhotoModalOpen && (
        <ReferenceImageModal
          images={imagePreviews.filter((img: string | null) => img !== null)}
          initialIndex={selectedPhotoIndex}
          onClose={() => setIsPhotoModalOpen(false)}
        />
      )}
    </div>
  );
}
