import Button from "../../ui/button/Button";
import { useModalData } from "@/store/hooks/useModal";
import { Modal } from "@/components/ui/modal";

interface Props {
  modalId: string;
  data?: any;
}

const SaveChangesConfirmation: React.FC<Props> = ({ data }) => {
  const { close } = useModalData();

  return (
    <Modal
      isOpen
      onClose={close}
      className="max-w-[360px] m-4"
      outsideClick={false}
    >
      <div className="sheet-gradient-bg text-center items-center no-scrollbar relative w-full overflow-y-auto rounded-2xl py-10 px-6 lg:p-10">
        <div className="px-2">
          <h4 className="mb-2 text-[20px] font-semibold text-black dark:text-white/90">
            {data.title || "Are you sure you want to submit this form?"}
          </h4>
        </div>
        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
          <div className="">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
              <div className="col-span-2 lg:col-span-1 text-black dark:text-white/90">
                {data.description}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 justify-center">
          <Button
            size="rg"
            variant="dark"
            onClick={(e) => {
              e.stopPropagation();
              data.cancel();
              close();
            }}
            className="font-medium"
          >
            Close
          </Button>
          <Button
            size="rg"
            type="submit"
            onClick={() => {
              data.action();
            }}
            className="font-medium"
          >
            Discard Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SaveChangesConfirmation;

