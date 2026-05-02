// import Button from "../../ui/button/Button";
// import { Modal } from "../../ui/modal";
// import { useModalData } from "../../../redux/hooks/useModal";
// import Label from "../../form/Label";
// import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ToastService } from "../../../utils/toastService";
// import rolesService from "../../../api/services/rolesService";
// import MultiSelectDropdown from "../../ui/dropdown/MultiSelect";
// import {useEffect, useState } from "react";
// import { useGetPermissions } from "../../../hooks/queries/permisions/usePermissions";
// import editRolesValidation from "../../../validators/role.edit.validator";

// interface Props {
//   modalId: string;
//   data?: any;
// }

// const EditRole: React.FC<Props> = ({data}) => {
//   const { isButtonLoading } = useGlobalStates();
//   const [permissions, setPermissions] = useState<[]>([]);
//   const [selectedOptions, setSelectedOptions] = useState<[]>([])

//   const { data: permissionData } = useGetPermissions();
//   const { close } = useModalData();
//   const [isOpen, setIsOpen] = useState<boolean>(false);


//   useEffect(() => {
//     if (permissionData) {
//       const transformed = permissionData?.permissions?.map((permission: any) => ({
//         value: permission.id.toLowerCase(),
//         label: permission.description.toString()
//       }));
//       setPermissions(transformed);
//     }
//   }, [permissionData]);

//   useEffect(() => {
//     if (data) {
//       const transformed = data?.permissions?.map((permission: any) => ({
//         value: permission.id.toLowerCase(),
//         label: permission.description.toString()
//       }));
//       if(transformed.length > 0) {
//         setIsOpen(true)
//       }
//       setSelectedOptions(transformed)
//     }
//   }, [data]);

//   const {
//     handleSubmit,
//     setValue
//   } = useForm({
//     shouldFocusError: false,
//     defaultValues: {
//       permissionIds: []
//     },
//     mode: "onChange",
//     reValidateMode: "onChange",
//     resolver: zodResolver(editRolesValidation),
//   });

//   const handleFormSubmit = async (formData: any, e: any) => {
//     e.preventDefault();


//       const response  = await rolesService.updateRole(formData, data?.id)

//       if(response?.success) {
//         ToastService.success(`${response.message}`, "add-role");
//         close();

//       } else {
//         ToastService.error(`${response.message || 'Something Went Wrong'}`, "add-role-error")
//       }
  
//   };

//   const handleSelectionChange = (newSelection: []) => {
//     setSelectedOptions(newSelection);
//     // setValue('permissions', permissionValues)

//   };

//   useEffect(()=> {
//     const permissionValues = selectedOptions?.map((item: any) => item.value);
//     setValue('permissionIds', permissionValues);
//       }, [selectedOptions])

//   return (
//     <Modal
//       isOpen
//       onClose={close}
//       className="max-w-[800px] m-4"
//       outsideClick={false}
//     >
//       <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-black lg:p-11">
//         <div className="px-2 pr-14">
//           <h4 className="mb-2 text-2xl font-semibold text-black dark:text-white/90">
//             Edit Role
//           </h4>
//           <p className="mb-6 text-sm text-gray-500 black-text lg:mb-7">
//             Edit the role {data?.name}
//           </p>
//         </div>
//         <form onSubmit={handleSubmit(handleFormSubmit)}>
//           <div className="custom-scrollbar h-[60vh] overflow-y-auto px-2 pb-3">
           
//             <div className="">
//               <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
//                 <div className="col-span-2 lg:col-span-1">
//                 <Label>Select Permissions</Label>
//                 <MultiSelectDropdown title={""} options={permissions} selectedOptions={selectedOptions} setSelectedOptions={handleSelectionChange} isOpen={isOpen} setIsOpen={setIsOpen}/>
//                   {/* <Input
//                     type="text"
//                     register={register}
//                     registerOptions={"name"}
//                     errors={errors}
//                     placeholder="Name"
//                   /> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 close();
//               }}
//             >
//               Close
//             </Button>
//             <Button
//               size="sm"
//               type="submit"
//               loadingState={isButtonLoading("edit-role")}
//             >
//               Save Changes
//             </Button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default EditRole;
