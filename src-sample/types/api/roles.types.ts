import { Permission } from "./permissions.types";
export type Role = {
    id: string;
    name: string;
    isPermanent: boolean;
    permissions: Permission[]; // Reusing from the first type
  };
  
  export type RolesResponse = {
    success: boolean;
    message: string;
    roles: Role[];
  };
  
  
  export interface CreateRoleResponse {
    success: boolean;
    message: string;
    role: Role;
  }

  export interface DeleteRoleResponse {
    success: boolean;
    message: string;
  }
  
  
