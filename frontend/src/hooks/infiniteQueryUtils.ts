import { InfiniteData } from "@tanstack/react-query";
import { PaginatedResponse } from "../types/pagination";

export const flattenInfiniteItems = <T>(
  data?: InfiniteData<PaginatedResponse<T>>,
) => data?.pages.flatMap((page) => page.items) || [];

export const getNextOffset = <T>(lastPage: PaginatedResponse<T>) =>
  lastPage.pagination.hasMore ? lastPage.pagination.nextOffset : undefined;

export const prependInfiniteItems = <T>(
  data: InfiniteData<PaginatedResponse<T>> | undefined,
  nextItems: T[],
) => {
  if (!data?.pages?.length || nextItems.length === 0) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page, index) =>
      index === 0
        ? {
            ...page,
            items: [...nextItems, ...page.items],
          }
        : page,
    ),
  };
};
