export type Permission = {
    id: string;
    name: string;
    description: string;
  };
  
  export type PermissionsResponse = {
    success: boolean;
    message: string;
    permissions: Permission[];
  };
  