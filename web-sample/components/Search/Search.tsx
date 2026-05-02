"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  InfiniteLoader,
  GlobalLoader,
} from "@repo/ui/index";
import React, { useState, useMemo } from "react";
import { UserSearch } from "../Features/UserSearch";
import { useSearchUsers } from "@/hooks/userServices/useSearchUsers";
import { UserCard } from "../Features/UserCard";
import { Search as SearchIcon } from "lucide-react";

const SearchInput = () => {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const {
    data: userData,
    isLoading: isUserLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching: isUserFetching,
  } = useSearchUsers(debouncedQuery, 21); // 21 to fit grid of 3 nicely

  // ------ Derived Data ------
  const users = useMemo(() => {
    return userData?.pages?.flatMap((page: any) => page?.data || []) || [];
  }, [userData]);

  const renderUserGrid = (isLoading: boolean) => {
    if (isLoading) {
      return <GlobalLoader />;
    }

    if (!isLoading && users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-semibold truncate w-full max-w-[250px]">
            No users found for "{debouncedQuery}"
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try searching for a different name or username.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-1">
          {users.map((user: any) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
        
        <div className="py-2">
          <InfiniteLoader
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="px-6 py-6 h-full flex flex-col">
      <h3 className="mb-2 text-2xl font-medium">Search Here</h3>

      <UserSearch
        onSearch={setDebouncedQuery}
        placeholder="Search users..."
        isLoading={isUserFetching}
      />

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 m-4 bg-gray-100 rounded-full mx-0 mt-4 h-11 p-1">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
            For You
          </TabsTrigger>
          <TabsTrigger value="mentions" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
            Popular
          </TabsTrigger>
          <TabsTrigger value="interactions" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
            News
          </TabsTrigger>
          <TabsTrigger value="sport" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">
            Sport
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 px-4 pb-6 overflow-y-auto no-scrollbar">
          {/* Tabs Content */}
          <TabsContent value="all" className="mt-2 outline-none">
            {renderUserGrid(isUserLoading)}
          </TabsContent>

          <TabsContent value="mentions" className="mt-2 outline-none">
            {renderUserGrid(isUserLoading)}
          </TabsContent>

          <TabsContent value="interactions" className="mt-2 outline-none">
            {renderUserGrid(isUserLoading)}
          </TabsContent>

          <TabsContent value="sport" className="mt-2 outline-none">
            {renderUserGrid(isUserLoading)}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SearchInput;
