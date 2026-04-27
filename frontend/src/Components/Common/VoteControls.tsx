import React, { useEffect, useRef, useState } from 'react';
import { VoteSummary, VoteType } from '../../services/like.service';

interface VoteControlsProps {
  summary: VoteSummary;
  onVote: (voteType: VoteType) => void;
  disabled?: boolean;
  compact?: boolean;
}

const BUMP_DURATION_MS = 380;

export default function VoteControls({
  summary,
  onVote,
  disabled = false,
  compact = false,
}: VoteControlsProps) {
  const upActive = summary.userVote === 'upvote';
  const downActive = summary.userVote === 'downvote';
  const previousUpvotes = useRef(summary.upvotesCount);
  const previousDownvotes = useRef(summary.downvotesCount);
  const [upvoteBump, setUpvoteBump] = useState(false);
  const [downvoteBump, setDownvoteBump] = useState(false);

  useEffect(() => {
    if (summary.upvotesCount !== previousUpvotes.current) {
      setUpvoteBump(true);
      const timeout = setTimeout(() => setUpvoteBump(false), BUMP_DURATION_MS);
      previousUpvotes.current = summary.upvotesCount;
      return () => clearTimeout(timeout);
    }

    previousUpvotes.current = summary.upvotesCount;
    return undefined;
  }, [summary.upvotesCount]);

  useEffect(() => {
    if (summary.downvotesCount !== previousDownvotes.current) {
      setDownvoteBump(true);
      const timeout = setTimeout(() => setDownvoteBump(false), BUMP_DURATION_MS);
      previousDownvotes.current = summary.downvotesCount;
      return () => clearTimeout(timeout);
    }

    previousDownvotes.current = summary.downvotesCount;
    return undefined;
  }, [summary.downvotesCount]);

  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote('upvote')}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
          upvoteBump ? 'scale-110 shadow-[0_0_0_1px_rgba(52,211,153,0.25)]' : ''
        } ${
          upActive
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400'
        }`}
      >
        <i className={`fa-solid fa-arrow-up text-sm ${upvoteBump ? 'animate-pulse' : ''}`}></i>
        <span>{summary.upvotesCount}</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote('downvote')}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
          downvoteBump ? 'scale-110 shadow-[0_0_0_1px_rgba(251,113,133,0.25)]' : ''
        } ${
          downActive
            ? 'bg-rose-500/10 text-rose-400'
            : 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'
        }`}
      >
        <i className={`fa-solid fa-arrow-down text-sm ${downvoteBump ? 'animate-pulse' : ''}`}></i>
        <span>{summary.downvotesCount}</span>
      </button>
    </div>
  );
}
