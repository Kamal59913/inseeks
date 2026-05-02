import React from 'react'
import { Link } from 'react-router-dom'
import { useModalData } from '../../store/hooks';
import VoteControls from '../Common/VoteControls';
import { useVoteQuery } from '../../hooks/useVoteQuery';
import Button from '../Common/Button';
import ImageWithFallback from '../Common/ImageWithFallback';
import { copyToClipboard } from '../../utils/clipboardUtils';
import PostOptionsMenu from './PostOptionsMenu';
import { useCurrentUserQuery } from '../../hooks/useCurrentUserQuery';

export default function PostVideos(props: any) {
  const modal = useModalData()
  const { data: currentUser } = useCurrentUserQuery()
  const { summary, vote, isVoting } = useVoteQuery(props.type, props.postId, {
    upvotesCount: props.upvotesCount || 0,
    downvotesCount: props.downvotesCount || 0,
    userVote: props.userVote || null,
    score:
      typeof props.score === 'number'
        ? props.score
        : (props.upvotesCount || 0) - (props.downvotesCount || 0),
  })

  const sendData = () =>
    modal.open('view-video-post', {
      temp: props,
    })

  return (
 <div className="bg-[#111827] rounded-2xl overflow-hidden transition-all duration-200 w-full animate-fade-in">
      <div className="flex items-center gap-3 p-4">
        <Link to={`/user/${props.author}`}>
          <ImageWithFallback 
            variant="avatar"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2a3d5c] hover:ring-indigo-500 transition-all" 
            src={props.avatar} 
            alt={props.author}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/user/${props.author}`} className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors">{props.author}</Link>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
            {props.community ? (
              <Link
                to={`/env-home-page/${props.community}`}
                className="truncate font-medium text-slate-400 hover:text-indigo-400 transition-colors"
              >
                / {props.community}
              </Link>
            ) : null}
            <span>{new Date(props.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <PostOptionsMenu
          postId={props.postId}
          postType={props.type || 'video'}
          authorUsername={props.author}
          currentUsername={currentUser?.username}
          postData={{ title: '', description: props.description, community: props.community }}
        />
      </div>

      {props.description && (
        <p className="px-4 pb-3 text-sm text-slate-400 line-clamp-2">{props.description}</p>
      )}

      {props.video && (
        <div className="px-4 pb-3">
          <video
            src={props.video}
            controls
            onClick={() => window.open(props.video, '_blank')}
            className="w-full h-52 rounded-xl object-cover bg-black cursor-pointer hover:opacity-90 transition-opacity"
          />
        </div>
      )}

 <div className="flex items-center justify-between px-4 py-3 ">
        <div className="flex items-center gap-1">
          <VoteControls summary={summary} onVote={vote} disabled={isVoting} />
          <Button
            variant="custom"
            size="none"
            borderRadius="rounded-lg"
            onClick={sendData}
            title="Real time discussions"
            aria-label="Real time discussions"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
          >
            <i className="fa-regular fa-comments text-base"></i>
            <span>{props.conversationCount || 0}</span>
          </Button>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {props.views !== undefined && <span className="flex items-center gap-1"><i className="fa-regular fa-eye"></i>{props.views}</span>}
          <Button
            variant="custom"
            size="none"
            borderRadius="rounded-lg"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(`${window.location.origin}/post/${props.postId}`); }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 px-3 py-1.5"
          >
            <i className="fa-regular fa-share-from-square text-base"></i>
          </Button>
        </div>
      </div>
    </div>
  )
}
