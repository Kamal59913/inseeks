import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModalData } from "../../../redux/hooks/useModal";
// import DropzoneComponent from "../../form/form-elements/DropZone";
// import { ToastService } from "../../../utils/toastService";
// import profileUpdateService from "../../../api/services/profileUpdateService";
// import { handleError } from "../../../utils/handleError";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
// import { useForm } from "react-hook-form";
// import imageValidation from "../../../validators/image.create.validator";

interface Props {
  modalId: string;
  data?: any;
}

const ProfileOne: React.FC<Props> = ({}) => {
  const { close } = useModalData();
  const { isButtonLoading } = useGlobalStates();
  
  // const {
  //   control,
  //   watch,
  //   setValue,
  //   handleSubmit,
  // } = useForm({
  //   shouldFocusError: false,
  //   defaultValues: {
  //     file: userData?.image || "",
  //   },
  //   mode: "onChange",
  //   reValidateMode: "onChange",
  //   resolver: zodResolver(imageValidation),
  // });

  // const imageFile = watch("file");

  // const handleFormSubmit = async (data: any, e: any) => {
  //   e.preventDefault();
  //   try {
  //     let response;
  //     if (data?.file) {
        // response = await profileUpdateService.imageUpload(data);
      // }

      // if (response?.status == 200 || !data?.file) {
      //   await profileUpdateService.editProfile({
      //     name: userData?.name || "",
      //     phone: userData?.phone || "",
      //     email: "",
      //     image: response?.data?.url || "",
      //     device_type: "web",
      //     device_token: "kasjfkljasfaweuru4537rye",
      //   });
      // }
  //     close()
  //     ToastService.success(`Successfully Updated User`, "userUpdate");
  //   } catch (error) {
  //     ToastService.error(handleError(error));
  //   } finally {
  //   }
  // };

  return (
    <Modal
      isOpen
      onClose={close}
      className="max-w-[700px] m-4"
      outsideClick={false}
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-black lg:p-11">
        <div className="px-2 pr-14">
          <h5 className="mb-6 text-xl font-semibold text-black dark:text-white/90">
            Change Profile Image
          </h5>
          {/* <p className="mb-6 text-xl text-black dark:text-white/90 lg:mb-7">
            Change Profile Image
          </p> */}
        </div>
        <form
          className="flex flex-col"
          // onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="custom-scrollbar h-[360px] overflow-y-auto px-2 pb-3">
            {/* <div>
                <h5 className="mb-5 text-lg font-medium text-black dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      value="https://www.facebook.com/PimjoHQ"
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input type="text" value="https://x.com/PimjoHQ" />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      value="https://www.linkedin.com/company/pimjo"
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input type="text" value="https://instagram.com/PimjoHQ" />
                  </div>
                </div>
              </div> */}
            {/* <DropzoneComponent
              title={"Change Profile Image"}
              control={control}
              name="file"
              setValue={setValue}
              currentImage={imageFile}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
            /> */}
            {/* <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-black dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input type="text" value="Musharof" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text" value="Chowdhury" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="text" value="randomuser@pimjo.com" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" value="+09 363 398 46" />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" value="Team Manager" />
                  </div>
                </div>
              </div> */}
          </div>
          <div className="flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={close}>
              Close
            </Button>
            <Button
              size="sm"
              type="submit"
              loadingState={isButtonLoading("inserting_image")}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileOne;
