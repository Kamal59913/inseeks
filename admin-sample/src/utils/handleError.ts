import { AxiosError } from "axios";

export const handleError = (error: unknown) => {
  
  const isAxiosError =  error && typeof error === "object" && "isAxiosError" in error;

  if (isAxiosError) {
    const axiosError = error as AxiosError<any>;
    const backendData = axiosError.response?.data;
    
    const normalizedError = {
      status: axiosError.response?.status ?? 500,
      data:
        backendData ??
        ({
          message: axiosError.message || "Something went wrong",
        } as any),
    };

    return normalizedError;
  }


  const fallbackError = {
    status: 500,
    data: {
      message: "An unexpected error occurred",
    },
  };

  return fallbackError;
};