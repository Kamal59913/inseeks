import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModalData } from "@/store/hooks/useModal";

interface Props {
  modalId: string;
  data?: any;
}

const EmailSentNotificationModal: React.FC<Props> = ({ data }) => {
  const { close } = useModalData();

  return (
    <Modal
      isOpen
      onClose={close}
      className="max-w-[353px] m-4"
      outsideClick={false}
    >
      <div className="sheet-gradient-bg text-center items-center no-scrollbar relative w-full overflow-y-auto rounded-2xl p-4 lg:p-6">
        <div className="px-2 flex flex-col items-center">
          <img src={"/exclamation_sign.svg"} className="mx-auto" />
          <h4 className="mb-2 text-[16px] font-semibold text-black dark:text-white/90 mt-6">
            {data?.title}
          </h4>
        </div>
        <div className="text-center custom-scrollbar overflow-y-auto px-2 pb-3">
          <div className="">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
              <div className="col-span-2 lg:col-span-1 text-black dark:text-white/90 text-[12px]">
                {data?.description}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 px-2 mt-6 justify-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="w-full h-[36px] text-[14px]"
            size="none"
            variant="dark"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailSentNotificationModal;

