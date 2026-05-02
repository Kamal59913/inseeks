import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  InfiniteLoader,
} from "@repo/ui/index";
import { X, Users } from "lucide-react";
import { GlobalLoader } from "@repo/ui/index";
import { useGetBlockedUsers } from "@/hooks/userServices/useGetBlockedUsers";
import { useGetHiddenUsers } from "@/hooks/userServices/useGetHiddenUsers";
import { useUserActions } from "@/hooks/userServices/useUserActions";
import { useMemo } from "react";
import { ModalEntry } from "@/store/useModalStore";

interface BlockedUsersModalProps {
  modal?: ModalEntry;
  isOpen?: boolean;
  onClose: () => void;
  type?: "blocked" | "muted";
}

const BlockedUsersModal = ({
  modal,
  isOpen = true,
  onClose,
  type,
}: BlockedUsersModalProps) => {
  const actualType = (modal?.data as any)?.type || type || "blocked";
  const actualIsOpen = modal ? true : isOpen;
  const isBlockedType = actualType === "blocked";

  const blockedQuery = useGetBlockedUsers(20, { enabled: actualIsOpen && isBlockedType });
  const hiddenQuery = useGetHiddenUsers(20, { enabled: actualIsOpen && !isBlockedType });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = isBlockedType ? blockedQuery : hiddenQuery;

  const { unblockUser, isUnblocking, unhideUser, isUnhiding } = useUserActions();

  const users = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.data || []) || [];
  }, [data]);

  const handleAction = (username: string) => {
    if (isBlockedType) {
      unblockUser(username);
    } else {
      unhideUser(username);
    }
  };

  const isActionPending = isBlockedType ? isUnblocking : isUnhiding;

  return (
    <Dialog open={actualIsOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white border-0 shadow-xl sm:rounded-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {isBlockedType ? "Blocked Users" : "Muted Users"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {isLoading || (isFetching && users.length === 0) ? (
            <GlobalLoader />
          ) : isError ? (
            <div className="text-center py-10 text-red-500">
              <p className="text-sm">Failed to load users.</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">
                No {isBlockedType ? "blocked" : "muted"} users
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Users you {isBlockedType ? "block" : "mute"} will appear here
              </p>
            </div>
          ) : (
            <>
              {users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarImage src={user.profile_photo_url} alt={user.full_name || user.username} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 font-medium">
                        {(user.full_name || user.username || "").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {user.full_name || user.username}
                      </span>
                      <span className="text-xs text-gray-500">@{user.username}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-4 text-xs font-medium border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors rounded-lg"
                    onClick={() => handleAction(user.username)}
                    disabled={isActionPending}
                  >
                    {isBlockedType ? "Unblock" : "Unmute"}
                  </Button>
                </div>
              ))}
              <InfiniteLoader
                onLoadMore={fetchNextPage}
                hasMore={hasNextPage}
                isLoading={isFetchingNextPage}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedUsersModal;
