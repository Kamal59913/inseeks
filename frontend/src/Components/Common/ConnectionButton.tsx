import React, { useEffect, useState } from 'react';
import { useToggleFollowMutation } from '../../hooks/useNetworkQueries';

interface ConnectionButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  connectedLabel?: React.ReactNode;
  disconnectedLabel?: React.ReactNode;
  connectedClassName: string;
  disconnectedClassName: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ConnectionButton({
  userId,
  initialIsFollowing = false,
  connectedLabel = 'Connected',
  disconnectedLabel = 'Connect',
  connectedClassName,
  disconnectedClassName,
  className = '',
  onClick,
}: ConnectionButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const toggleFollowMutation = useToggleFollowMutation();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick?.(event);

    const previousState = isFollowing;
    const nextState = !previousState;

    setIsFollowing(nextState);
    toggleFollowMutation.mutate(
      { userId, shouldFollow: nextState },
      {
        onError: () => {
          setIsFollowing(previousState);
        },
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggleFollowMutation.isPending}
      className={`${className} ${
        isFollowing ? connectedClassName : disconnectedClassName
      } ${toggleFollowMutation.isPending ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      {isFollowing ? connectedLabel : disconnectedLabel}
    </button>
  );
}
