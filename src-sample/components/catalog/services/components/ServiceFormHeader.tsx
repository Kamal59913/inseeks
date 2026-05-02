import Button from "@/components/ui/button/Button";

interface Props {
  isEditMode: boolean;
  onClose: () => void;
}

export const ServiceFormHeader = ({ isEditMode, onClose }: Props) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
      <Button
        variant="glass"
        size="sm"
        borderRadius="rounded-[16px]"
        className="font-medium active:scale-95 transition-all"
        onClick={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        Cancel
      </Button>
      <h2 className="text-white font-medium">
        {isEditMode ? "Update Service" : "Create a Service"}
      </h2>
      <Button
        variant="white"
        borderRadius="rounded-full"
        className="text-[14px] font-medium active:scale-95 transition-all"
        size="sm"
        type="submit"
      >
        Save
      </Button>
    </div>
  );
};
