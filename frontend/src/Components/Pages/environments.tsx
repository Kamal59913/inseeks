import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SearchBar from '../Utilities/SearchBar';
import LeftBar from '../Utilities/LeftBar';
import EnvCard from '../envComponents/envCard';
import { useModalData } from '../../store/hooks';
import { useEnvironmentQuery } from '../../hooks/useEnvironmentQuery';
import { queryKeys } from '../../hooks/queryKeys';
import { useSearchQuery } from '../../hooks/useSearchQuery';
import { SearchSpace } from '../../types/search';
import ImageWithFallback from '../Common/ImageWithFallback';
import UnifiedSearch from '../Utilities/UnifiedSearch';
import PageLoader from '../Common/PageLoader';
import InfiniteLoader from '../Common/InfiniteLoader';

export default function Environments() {
  const modal = useModalData();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [recommendationQuery, setRecommendationQuery] = useState('');
  const {
    data: holdEnvData,
    isLoading: isEnvironmentsLoading,
    fetchNextPage: fetchNextEnvironmentPage,
    hasNextPage: hasNextEnvironmentPage,
    isFetchingNextPage: isFetchingNextEnvironmentPage,
  } = useEnvironmentQuery(8);
  const {
    data: suggestionResults,
    isFetching: isSuggestionsLoading,
    fetchNextPage: fetchNextSuggestionPage,
    hasNextPage: hasNextSuggestionPage,
    isFetchingNextPage: isFetchingNextSuggestionPage,
  } =
    useSearchQuery(recommendationQuery, 'spaces', 6);

  const recommendations = suggestionResults?.spaces || [];

  const filtered = useMemo(
    () =>
      holdEnvData?.items?.filter(
        (e: any) =>
          e.name?.toLowerCase().includes(search.toLowerCase()) ||
          e.description?.toLowerCase().includes(search.toLowerCase()),
      ),
    [holdEnvData, search],
  );

  const refreshEnvs = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.environments });
  };

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar />

        <div className="max-w-6xl mx-auto w-full px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Spaces</h1>
              <p className="text-sm text-slate-400 mt-1">Join communities that match your interests</p>
            </div>
            <button
              onClick={() => modal.open('create-env', { onCreated: refreshEnvs })}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              Create Space
            </button>
          </div>

          <div className="mb-8">
            <div className="max-w-md">
              <UnifiedSearch<SearchSpace>
                value={search}
                onValueChange={setSearch}
                onInputChange={setRecommendationQuery}
                onSearch={setSearch}
                placeholder="Search spaces..."
                isRecommendationsLoading={isSuggestionsLoading}
                recommendations={recommendations}
                getRecommendationLabel={(item) => item.name}
                renderRecommendation={(item, index, isSelected, onSelect) => (
                  <button
                    key={`${item._id}-${index}`}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      isSelected ? 'bg-indigo-600/10' : 'hover:bg-[#1a2540]'
                    }`}
                  >
                    <ImageWithFallback
                      variant="avatar"
                      src={item.envAvatar}
                      alt={item.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {item.description || 'Explore this space'}
                      </p>
                    </div>
                  </button>
                )}
                emptyMessage="No matching spaces found"
                hasNextPage={hasNextSuggestionPage}
                fetchNextPage={fetchNextSuggestionPage}
                isFetchingNextPage={isFetchingNextSuggestionPage}
              />
            </div>
          </div>

          {isEnvironmentsLoading ? (
            <PageLoader />
          ) : filtered && filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((env: any, index: number) => (
                <EnvCard
                  key={`${env._id || env.name}-${index}`}
                  title={env.name}
                  description={env.description}
                  avatar={env.envAvatar}
                  isJoined={env.isJoined}
                />
                ))}
              </div>
              {!search.trim() ? (
                <InfiniteLoader
                  onLoadMore={fetchNextEnvironmentPage}
                  hasMore={hasNextEnvironmentPage}
                  isLoading={isFetchingNextEnvironmentPage}
                  label="Loading more spaces..."
                />
              ) : null}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <i className="fa-solid fa-seedling text-5xl mb-4 text-slate-600"></i>
              <p className="text-base font-medium">No spaces found</p>
              <p className="text-sm mt-1">Create one to get started!</p>
              <button
                onClick={() => modal.open('create-env', { onCreated: refreshEnvs })}
                className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Create Space
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
