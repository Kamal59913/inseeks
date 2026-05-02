import { DeleteIcon, EditIcon, EyeIcon, PoundIcon } from "../../icons";
import Tooltip from "../ui/tooltip/tooltip";

interface ActionIconsProps {
  isPermanent?: boolean;
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  title: string;
  editText?: string;
  onPriceEdit?: () => void;
}

export const ActionIcons: React.FC<ActionIconsProps> = ({
  isPermanent = false,
  onEdit,
  onDelete,
  title,
  onView,
  editText = "Edit",
  onPriceEdit,
}) => {
  return (
    <div className="flex gap-2">
      {onView && (
        <Tooltip text={`View ${title}`}>
          <EyeIcon
            className={`dark:text-white dark:text-gray-400 cursor-pointer hover:text-green-500 dark:hover:text-green-500`}
            onClick={onView}
          />
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip text={`${editText} ${title}`}>
          <EditIcon
            className={`dark:text-white dark:text-gray-400 cursor-pointer hover:text-green-500 dark:hover:text-green-500`}
            onClick={onEdit}
          />
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip text={`Delete ${title}`}>
          {!isPermanent && (
            <DeleteIcon
              className={`dark:text-white dark:text-gray-400 cursor-pointer text-medium hover:text-red-500 dark:hover:text-red-500`}
              onClick={!isPermanent ? onDelete : undefined}
            />
          )}
        </Tooltip>
      )}

      {onPriceEdit && (
        <Tooltip text={`${editText} ${title}`}>
          <PoundIcon
            className={`dark:text-white dark:text-gray-400 cursor-pointer hover:text-green-500 dark:hover:text-green-500`}
            onClick={onPriceEdit}
          />
        </Tooltip>
      )}
    </div>
  );
};
