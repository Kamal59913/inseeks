// import { useQuery, UseQueryResult } from '@tanstack/react-query';
// import fetchUsersService from '../../api/services/fetchUsersService';


// export const useUserSpam = (): UseQueryResult<any, Error> => {
//   return useQuery<any, Error>({
//     queryKey: ['userSpam'],
//     queryFn: () => fetchUsersService.fetchSpamUsers(),
//     staleTime: 1000 * 60 * 5,
//     gcTime: 1000 * 60 * 10,
//     refetchOnWindowFocus: false,
//   });
// };
