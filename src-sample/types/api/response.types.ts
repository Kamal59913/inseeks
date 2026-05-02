import { AxiosResponse } from "axios";

export interface BadResponse {
  status: number;
  data: {
    message: string;
    [key: string]: any;
  };
}

export type ServiceResponse<T> = Promise<AxiosResponse<T> | BadResponse>;
