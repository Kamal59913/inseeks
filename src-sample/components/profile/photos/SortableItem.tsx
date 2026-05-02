import profilePortfolioService from "@/services/profilePortfolioServices";
import { ToastService } from "@/lib/utilities/toastService";
import { useModalData } from "@/store/hooks/useModal";
import {
  useSortable
} from "@dnd-kit/sortable";
import { GripVertical, X } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem: React.FC<{
  img_url: string;
  img_id: string | number;
  onRemove: (id: string | number) => void;
  onClick: () => void;
}> = ({ img_url, img_id, onRemove, onClick }) => {
  const { open, close } = useModalData();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: img_id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deletePhotos = async (_id: string | number) => {
    const response = await profilePortfolioService.deletePortfolioImagesById(
      _id.toString()
    );

    if (response.status === 200) {
      ToastService.success(
        `${(response as any).data?.message || "Portfolio Image Deleted Successfully"}`,
        "delete-portfolio-image"
      );
      close();
    } else {
      ToastService.error(
        `${(response as any).data?.message || "Failed Deleting Portfolio Image"}`,
        "delete-portfolio-image-fail"
      );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-full aspect-square"
    >
      {/* Clickable Image Wrapper with Overflow Hidden */}
      <div 
        className="w-full h-full rounded-md overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <img
          src={img_url}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Drag Handle - Top Left */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-black/60 rounded p-1 cursor-grab active:cursor-grabbing hover:bg-black/80 transition"
      >
        <GripVertical size={14} className="text-white" />
      </div>

      {/* Delete Button - Top Right */}
      <button
        onClick={(e) => {
          e.preventDefault();
          open("delete-action", {
            title: "Delete Confirmation!",
            description: "Are you sure you want to delete this Image?",
            action: () => {
              deletePhotos(img_id);
            },
          });
        }}
        className="absolute -top-[7px] -right-[7px] z-10 bg-white w-5 h-5 flex items-center justify-center rounded-full text-black p-0.5 hover:bg-red-600 transition cursor-pointer shadow-sm"
      >
        <X size={14} />
      </button>
    </div>
  );
};
