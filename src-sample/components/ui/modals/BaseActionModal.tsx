import { Modal } from "../modal";
import Button from "../button/Button";
import { useModalData } from "@/store/hooks/useModal";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";

interface BaseActionModalProps {
  title?: string;
  description?: string | React.ReactNode;
  actionLabel?: string;
  cancelLabel?: string;
  actionId?: string; // Used for loading state mapping
  onAction: () => void;
  variant?: "primary" | "dark" | "danger" | "none";
  children?: React.ReactNode;
  showTitle?: boolean;
  icon?: React.ReactNode;
  actionClassName?: string;
  cancelClassName?: string;
  containerClassName?: string;
  buttonLayout?: "horizontal" | "vertical";
  titleClassName?: string;
  modalWidth?: string;
  descriptionClassName?: string;
}

export const BaseActionModal: React.FC<BaseActionModalProps> = ({
  title,
  description,
  actionLabel = "Confirm",
  cancelLabel = "Close",
  actionId = "confirm-action",
  onAction,
  variant = "primary",
  children,
  showTitle = true,
  icon,
  actionClassName,
  cancelClassName,
  containerClassName = "py-10 lg:p-10",
  buttonLayout = "vertical",
  titleClassName = "text-[20px] font-semibold",
  modalWidth = "max-w-[360px]",
  descriptionClassName = "text-black dark:text-white/90 mb-4 whitespace-pre-wrap",
}) => {
  const { close } = useModalData();
  const { isButtonLoading } = useGlobalStates();

  return (
    <Modal
      isOpen
      onClose={close}
      className={`${modalWidth} m-4`}
      outsideClick={false}
    >
      <div className={`sheet-gradient-bg text-center items-center no-scrollbar relative w-full overflow-y-auto rounded-2xl ${containerClassName}`}>
        <div className="px-2 flex flex-col items-center">
          {icon && <div className="mb-4">{icon}</div>}
          {showTitle && title && (
            <h4 className={`mb-2 text-black dark:text-white/90 ${titleClassName}`}>
              {title}
            </h4>
          )}
        </div>
        
        <div className="custom-scrollbar overflow-y-auto px-2 pb-3 w-full">
          {description && (
            <div className={`${descriptionClassName}`}>
              {description}
            </div>
          )}
          {children}
        </div>

        <div className={`flex items-center gap-3 px-2 mt-6 justify-center ${
          buttonLayout === "vertical" ? "flex-col gap-2" : "flex-row"
        }`}>
          <Button
            size="rg"
            variant="dark"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className={cancelClassName || "font-medium"}
          >
            {cancelLabel}
          </Button>
          <Button
            size="rg"
            type="submit"
            variant={variant === "none" ? undefined : (variant === "danger" ? "primary" : variant)}
            loadingState={isButtonLoading(actionId)}
            onClick={onAction}
            className={actionClassName || "font-medium"}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
