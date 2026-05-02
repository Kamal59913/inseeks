import { useModalData } from "@/store/hooks/useModal";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, X } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem: React.FC<{
  img_url: string;
  img_id: string;
  onRemove: (id: string) => void;
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

  const handleDelete = () => {
    open("delete-action", {
      title: "Delete Confirmation!",
      description: "Are you sure you want to delete this Image?",
      isTitleShow: false,
      action: () => {
        onRemove(img_id);
        close();
      },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-[100px] h-[100px] rounded-md overflow-hidden"
    >
      {/* Clickable Image */}
      <img
        src={img_url}
        alt=""
        className="w-full h-full object-cover cursor-pointer"
        onClick={onClick}
      />

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
          handleDelete();
        }}
        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 hover:bg-red-600 transition cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};
