import apiClient from "./apiClient";
import { SearchScope } from "../types/search";
export const searchService = {
  search: (query: string, scope: SearchScope, limit = 6, offset = 0) =>
    apiClient.get("/search", { params: { q: query, scope, limit, offset } }),
};
