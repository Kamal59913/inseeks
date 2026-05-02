import freelancerServicesService from "@/services/freelancerServicesService";
import {
  Freelancer,
  FreelancerListResponse,
  FreelancerResponse,
} from "@/types/api/freelancer.types";
import { PaginationProps } from "@/types/useQueries/pagination.type";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const useGetFreeLancerServices = (
  pagination_props: PaginationProps = {},
  searchWord?: string,
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-services-freelancers", pagination_props, searchWord],
    queryFn: () =>
      freelancerServicesService.getServices(pagination_props, searchWord),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export const useGetFreelancerList = (options?: {
  enabled?: boolean;
}): UseQueryResult<AxiosResponse<FreelancerListResponse>, Error> => {
  return useQuery<AxiosResponse<FreelancerListResponse>, Error>({
    queryKey: ["freelancer-list"],
    queryFn: () => freelancerServicesService.getFreelancerList(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};

export const useGetFreelancerById = (
  id: string,
  options?: { enabled?: boolean },
): UseQueryResult<AxiosResponse<FreelancerResponse>, Error> => {
  return useQuery<AxiosResponse<FreelancerResponse>, Error>({
    queryKey: ["get-freelancer-byId", id],
    queryFn: () => freelancerServicesService.getFreelancerById(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};

export const useGetFreelancerByUserName = (
  username: string,
  options?: { enabled?: boolean },
): UseQueryResult<AxiosResponse<FreelancerResponse>, Error> => {
  return useQuery<AxiosResponse<FreelancerResponse>, Error>({
    queryKey: ["get-freelancer-by-username", username],
    queryFn: () => freelancerServicesService.getFreelancerByUserName(username),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
