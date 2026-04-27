/* DataContext.tsx */
import React, { createContext, useContext, ReactNode } from 'react';
import { UserListItem } from '../types/user';
import { useFollowedUsersQuery, useUnfollowedUsersQuery } from '../hooks/useNetworkQueries';

interface DataContextValue {
  data: UserListItem[] | null;
  datanotfollowed: UserListItem[] | null;
  avatar: string;
  fetchData: () => Promise<void>;
  fetchDataNotFollowed: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

/* default avatar */
const avatar =
  'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png';

export const UserListProvider = ({ children }: { children: ReactNode }) => {
  const { data: followedUsers } = useFollowedUsersQuery();
  const { data: unfollowedUsers } = useUnfollowedUsersQuery();

  return (
    <DataContext.Provider
      value={{
        data: followedUsers || null,
        datanotfollowed: unfollowedUsers || null,
        avatar,
        fetchData: async () => {}, // No-op since react-query handles it
        fetchDataNotFollowed: async () => {},
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within UserListProvider');
  return ctx;
};

export default DataContext;
