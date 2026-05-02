export interface LoginResponse {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
  
  export interface AuthCredentials {
    username: string;
    password: string;
  }
  
  export interface FogetPassword {
    email: string;
  }
  
  export interface ResetPassword {
    newPassword: string;
    token: string | null;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface ResetPasswordResponse {
    success: boolean;
    message: string;
  }
  
  export type UserType = "super" | "admin" | "teacher" | "student" | "parent"; // expand as needed

export type UserDetails = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string; // ISO string, or use `Date` if you're parsing
  updatedAt: string;
  type: UserType;
};

export type UserDetailsResponse = {
  success: boolean;
  message: string;
  data: UserDetails;
};


export type ForgetPasswordResponse = {
  success: boolean;
  message: string;
};

