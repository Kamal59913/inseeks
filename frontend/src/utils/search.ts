import {
  SearchPerson,
  SearchPost,
  SearchScope,
  SearchSpace,
} from "../types/search";
export const SEARCH_SCOPE_OPTIONS: Array<{ key: SearchScope; label: string }> =
  [
    { key: "all", label: "All" },
    { key: "people", label: "People" },
    { key: "spaces", label: "Spaces" },
    { key: "posts", label: "Posts" },
  ];
export const getSearchScopeForPath = (pathname: string): SearchScope => {
  if (
    pathname.startsWith("/environments") ||
    pathname.startsWith("/env-home-page/")
  ) {
    return "spaces";
  }
  if (pathname.startsWith("/home/follow")) {
    return "people";
  }
  return "all";
};
export const getSearchPlaceholder = (scope: SearchScope) => {
  if (scope === "people") return "Search people...";
  if (scope === "spaces") return "Search spaces...";
  if (scope === "posts") return "Search posts...";
  return "Search Inseeks...";
};
export const buildSearchResultsPath = (query: string, scope: SearchScope) =>
  `/searchresults?q=${encodeURIComponent(query)}&scope=${encodeURIComponent(scope)}`;
export const getSearchResultHref = (
  item: SearchPerson | SearchSpace | SearchPost,
  kind: "people" | "spaces" | "posts",
) => {
  if (kind === "people") {
    return `/user/${encodeURIComponent((item as SearchPerson).username)}`;
  }
  if (kind === "spaces") {
    return `/env-home-page/${encodeURIComponent((item as SearchSpace).name)}`;
  }
  const post = item as SearchPost;
  return post.author?.username
    ? `/user/${encodeURIComponent(post.author.username)}`
    : "/home";
};
