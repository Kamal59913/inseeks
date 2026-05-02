// In your component file
import Button from '../../ui/button/Button';
import { Modal } from '../../ui/modal';
import { useModalData } from '../../../redux/hooks/useModal';
// import editProfileValidation from '../../../validators/editProfile.validator';
import { useGlobalStates } from '../../../redux/hooks/useGlobalStates';
import Label from '@shared/common/components/ui/form/Label.js';

interface Props {
    modalId: string;
    data?: any;
  }
  
const ProfileTwo:React.FC<Props> = ({}) => {
    const { close } = useModalData();

      const { isButtonLoading } = useGlobalStates();
      // const { userData } = useUserData();
      // const {
      //   register,
      //   handleSubmit,
      //   formState: { errors },
      // } = useForm({
      //   shouldFocusError: false,
      //   defaultValues: {
      //     name: userData?.name || "",
      //     phone: userData?.phone || "",
      //     email: "",
      //     image: userData?.image || null, // Can be string URL or null initially
      //     device_type: "web",
      //     device_token: "kasjfkljasfaweuru4537rye",
      //   },
      //   mode: "onChange",
      //   reValidateMode: "onChange",
        // resolver: zodResolver(editProfileValidation),
      // });
    
      // const handleFormSubmit = async (data: any, e: any) => {
      //   e.preventDefault();
      //   try {
      //     await profileUpdateService.editProfile(data);
      //     ToastService.success(`Successfully Updated User`, "userUpdate");
      //     close()
      //   } catch (error) {
      //     ToastService.error(handleError(error));
      //   }
      // };
    
    
      
      return (
        <Modal isOpen onClose={close} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-black lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 black-text lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form 
          // onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {/* <div> */}
              {/* <h5 className="mb-5 text-lg font-medium text-black dark:text-white/90 lg:mb-6">
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
                </div> */}
              {/* </div> */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-black dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    {/* <Input
                      type="text"
                      register={register}
                      registerOptions={"name"}
                      errors={errors}
                    /> */}
                  </div>

                  {/* <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text" register={register} registerOptions={"lastName"} errors={errors} />
                  </div> */}

                  {/* <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="text" register={register} registerOptions={"email"} errors={errors}/>
                  </div> */}

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    {/* <Input
                      type="text"
                      register={register}
                      registerOptions={"phone"}
                      errors={errors}
                    /> */}
                  </div>

                  {/* <div className="col-span-2 lg:col-span-1">
                    <Label>Device Type</Label>
                    <Select
                      options={options}
                      placeholder="Select an option"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                    <Input type="text" register={register} registerOptions={"device_type"} errors={errors}/>
                  </div> */}

                  {/* <div className="col-span-2 lg:col-span-1">
                    <Label>Device Token</Label>
                    <Input
                      type="text"
                      register={register}
                      registerOptions={"device_token"}
                      errors={errors}
                    />
                  </div> */}
                  {/* 
                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" register={register} registerOptions={"bio"} />
                  </div> */}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={close}>
                Close
              </Button>
              <Button
                size="sm"
                type="submit"
                loadingState={isButtonLoading("edit-admin-profile")}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
  );
};

export default ProfileTwo;