import { BaseActionModal } from "../../ui/modals/BaseActionModal";

interface Props {
  modalId: string;
  data?: any;
}

const DeleteActionModal: React.FC<Props> = ({ data }) => {
  return (
    <BaseActionModal
      title={data?.title || "Delete Confirmation!"}
      showTitle={data?.isTitleShow !== false}
      description={data?.description}
      actionLabel="Confirm"
      actionId="confirm-delete"
      buttonLayout="horizontal"
      onAction={() => data.action()}
    />
  );
};

export default DeleteActionModal;

