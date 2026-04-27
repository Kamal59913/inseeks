import React, { useEffect, useState } from 'react';
import { useJoinEnvironmentMutation } from '../../hooks/useEnvironmentQuery';

interface SpaceJoinButtonProps {
  title: string;
  initialIsJoined?: boolean;
  joinedLabel?: React.ReactNode;
  unjoinedLabel?: React.ReactNode;
  joinedClassName: string;
  unjoinedClassName: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SpaceJoinButton({
  title,
  initialIsJoined = false,
  joinedLabel = 'Leave',
  unjoinedLabel = 'Join',
  joinedClassName,
  unjoinedClassName,
  className = '',
  onClick,
}: SpaceJoinButtonProps) {
  const [isJoined, setIsJoined] = useState(initialIsJoined);
  const joinMutation = useJoinEnvironmentMutation();

  useEffect(() => {
    setIsJoined(initialIsJoined);
  }, [initialIsJoined]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick?.(event);

    const previousState = isJoined;
    const nextState = !previousState;

    setIsJoined(nextState);
    joinMutation.mutate(
      { title, shouldJoin: nextState },
      {
        onError: () => {
          setIsJoined(previousState);
        },
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={joinMutation.isPending}
      className={`${className} ${
        isJoined ? joinedClassName : unjoinedClassName
      } ${joinMutation.isPending ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      {isJoined ? joinedLabel : unjoinedLabel}
    </button>
  );
}
