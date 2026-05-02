export interface School {
    id: string;
    registrationNumber: string;
    email: string;
    website: string;
    name: string;
    address: string;
    phone: string;
    establishedYear: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GetSchoolsResponse {
    success: boolean;
    message: string;
    schools: School[];
  }
  
  export interface GetSingleSchoolResponse {
    success: boolean;
    message: string;
    school: School;
  }

  export interface DeleteSchoolResponse {
    success: boolean;
    message: string;
  }
  

  
