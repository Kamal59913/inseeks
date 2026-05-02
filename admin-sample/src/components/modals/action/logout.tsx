import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import { useModalData } from "../../../redux/hooks/useModal";


interface Props {
  modalId: string;
  data?: any;
}

const LogoutActionModal: React.FC<Props> = ({data}) => {
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
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-black dark:text-white/90">
          Confirm Sign Out
          </h4>
          
        </div>
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div className="col-span-2 lg:col-span-1 text-black dark:text-white/90">
                Are you sure you want to Sign Out?
                </div>
              </div>
            </div>
           
          </div>
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
              onClick={()=> {
                data.action()
              }}
            >
            Sign Out
            </Button>
          </div>
      </div>
    </Modal>
  );
};

export default LogoutActionModal;
