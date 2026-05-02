import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, Trash2, GripVertical } from "lucide-react";

interface SortableBookingsItem {
  item: any;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SortableBookingsItem: React.FC<SortableBookingsItem> = ({
  item,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center group"
    >
      {/* Up/Down Arrow Buttons .*/}
      {/* <div className="flex flex-col gap-2 mr-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isFirst) onMoveUp();
          }}
          disabled={isFirst}
          className={`transition-colors cursor-pointer ${
            isFirst
              ? "text-gray-600 cursor-not-allowed"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
            <path d="M6 0L12 8H0L6 0Z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isLast) onMoveDown();
          }}
          disabled={isLast}
          className={`transition-colors cursor-pointer ${
            isLast
              ? "text-gray-600 cursor-not-allowed"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
            <path d="M6 8L0 0H12L6 8Z" />
          </svg>
        </button>
      </div> */}

      {/* Service Card */}
      <div
        className="service-category-card flex-1 px-5 py-4 hover:to-[#3a3a45] transition-all duration-200 flex items-center cursor-pointer"
        onClick={onEdit}
      >
        <div className="flex-1">
          <h2 className="text-[15px] font-semibold text-white leading-tight">
            {item.name}
          </h2>
          <p className="text-[13px] text-gray-400 mt-1">
            {item.serviceCategory?.name}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {item.options?.length || 0} option
            {item.options?.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-300 font-medium">
            £{item.options?.[0]?.price || 0}
          </span>

          {/* Drag Handle */}
          {/* <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={18} />
          </div> */}

          {/* <ChevronRight className="text-gray-400 w-4 h-4" /> */}
        </div>
      </div>
    </div>
  );
};

