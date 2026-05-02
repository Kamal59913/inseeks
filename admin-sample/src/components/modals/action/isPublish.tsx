import { useModalData } from "@/redux/hooks/useModal";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useGlobalStates } from "@/redux/hooks/useGlobalStates";

interface Props {
  modalId: string;
  data?: any;
}

const IsPublishedModal: React.FC<Props> = ({ data }) => {
  const { isButtonLoading } = useGlobalStates();
  const { close } = useModalData();

  return (
    <Modal
      isOpen
      onClose={close}
      className="max-w-[600px] m-4"
      outsideClick={false}
    >
      <div className="text-center no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-black lg:p-11">
        {/* Title */}
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-black dark:text-white/90">
            Confirmation!
          </h4>
        </div>

        {/* Description */}
        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
          <div className="col-span-2 lg:col-span-1 text-black dark:text-white/90">
            {data?.title}
          </div>
          <div className="text-black dark:text-white/80">
            {data?.description}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 px-2 mt-6 justify-center">
          <Button
            variant="dark"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            Close
          </Button>

          <Button
            type="submit"
            loadingState={isButtonLoading("confirm-delete")}
            onClick={() => data.action()}
          >
            {data?.type === "approve"
              ? "Activate Freelancer"
              : "Deactivate Freelancer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default IsPublishedModal;
