import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: number;
  image_url: string;
  thumbnail?: string | null;
  caption?: string;
  order_index?: number;
  status?: boolean;
  is_primary?: boolean;
}

interface PhotoGalleryModalProps {
  photos: Photo[];
  initialIndex?: number;
  onClose: () => void;
}

export default function PhotoGalleryModal({ 
  photos, 
  initialIndex = 0, 
  onClose 
}: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div
  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Container with max-width constraint */}
      <div className="w-full max-w-[380] h-full relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 text-white hover:text-gray-300"
        >
          <X size={32} strokeWidth={2} />
        </button>

        {/* Navigation buttons */}
        {photos.length > 1 && (
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
              src={currentPhoto.image_url}
              alt={currentPhoto.caption || `Photo ${currentIndex + 1}`}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>

          {/* Caption and counter */}
          <div className="text-center text-white space-y-2">
            {currentPhoto.caption && (
              <h2 className="text-xl font-medium">{currentPhoto.caption}</h2>
            )}
            <p className="text-sm text-gray-400">
              {currentIndex + 1} of {photos.length}
            </p>
          </div>
        </div>

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex gap-2 overflow-x-auto pb-2 px-6">
            {photos.map((photo, idx) => (
              <button
                key={photo.id || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  idx === currentIndex
                    ? "border-white scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo.thumbnail || photo.image_url}
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
