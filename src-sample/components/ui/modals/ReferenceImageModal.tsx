import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type ImageItem = string | { image_url: string };

interface ReferenceImageModalProps {
  images: ImageItem[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ReferenceImageModal({
  images,
  initialIndex = 0,
  onClose,
}: ReferenceImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  const getImageUrl = (item: ImageItem) => {
    if (typeof item === "string") return item;
    return item?.image_url || "";
  };

  const currentImage = images[currentIndex];
  const currentUrl = getImageUrl(currentImage);

  if (!currentUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center focus:outline-none"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      {/* Container with max-width constraint */}
      <div className="w-full max-w-[380px] h-full relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 text-white hover:text-gray-300"
        >
          <X size={32} strokeWidth={2} />
        </button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 text-white hover:text-gray-300"
            >
              <ChevronLeft size={48} strokeWidth={2} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 text-white hover:text-gray-300"
            >
              <ChevronRight size={48} strokeWidth={2} />
            </button>
          </>
        )}

        {/* Main content */}
        <div
          className="flex flex-col items-center justify-center flex-1 px-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="relative mb-6 w-full">
            <img
              src={currentUrl}
              alt={`Photo ${currentIndex + 1}`}
              className="w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Counter section */}
          <div className="text-center text-white space-y-2">
            <p className="text-sm text-gray-400">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex gap-2 overflow-x-auto pb-2 px-6">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? "border-white scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={getImageUrl(img)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

