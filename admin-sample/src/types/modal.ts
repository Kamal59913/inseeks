// Define individual modal types
type ModalPayloads = {
    'single-category': any
    //  {
    //   category: {
    //     id: string;
    //     name: string;
    //     subcategories: Array<{ id: string; name: string }>;
    //   };
    // };
    'add-category': undefined; // No data needed
    'edit-user': {
      userId: string;
      initialValues: {
        name: string;
        email: string;
      };
    };
    // Add more modals as needed
  };
  
  interface BaseModal<T = unknown> {
    type: string;
    data?: T;
  }
  
  export type ModalEntry = BaseModal & {
    id: string;
  };
  
  export type ModalType = keyof ModalPayloads;
  export type ModalData<T extends ModalType> = ModalPayloads[T];