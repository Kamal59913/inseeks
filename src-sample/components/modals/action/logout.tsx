import { BaseActionModal } from "@/components/ui/modals/BaseActionModal";

interface Props {
  modalId: string;
  data?: any;
}

const LogoutActionModal: React.FC<Props> = ({ data }) => {
  return (
    <BaseActionModal
      title="Confirm Sign Out"
      description="Are you sure you want to Sign Out?"
      actionLabel="Sign Out"
      actionId="confirm-delete"
      buttonLayout="horizontal"
      onAction={() => data.action()}
    />
  );
};

export default LogoutActionModal;

