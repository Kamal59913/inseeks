import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from '../Common/ImageWithFallback';
import SpaceJoinButton from '../Common/SpaceJoinButton';
import ContextMenu, { ContextMenuItem } from '../Common/ContextMenu';
import Button from '../Common/Button';
import { useCurrentUserQuery } from '../../hooks/useCurrentUserQuery';
import { useModalData } from '../../store/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../hooks/queryKeys';
import { envService } from '../../services/env.service';
import { copyToClipboard } from '../../utils/clipboardUtils';

interface EnvCardProps {
  title: string;
  description: string;
  avatar?: string;
  isJoined: boolean;
  creatorId?: string;
}

export default function EnvCard({ title, description, avatar, isJoined, creatorId }: EnvCardProps) {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUserQuery();
  const modal = useModalData();
  const queryClient = useQueryClient();

  const isOwner = currentUser && creatorId && currentUser._id === creatorId;

  const handleShare = () => {
    copyToClipboard(`${window.location.origin}/env-home-page/${title}`);
  };

  const handleEdit = () => {
    // Add logic for editing space if needed, perhaps through a generic edit modal
  };

  const handleDelete = () => {
    modal.open('confirm-delete' as any, {
      title: 'Delete Space',
      description: `Are you sure you want to delete ${title}? This will remove all posts inside it.`,
      confirmLabel: 'Delete',
      onConfirm: async () => {
        try {
          await envService.deleteEnvironment(title);
          queryClient.invalidateQueries({ queryKey: queryKeys.environments });
        } catch (err) {
          console.error('Failed to delete space:', err);
        }
      },
    });
  };

  const menuItems: ContextMenuItem[] = [
    { label: 'Share', icon: 'fa-share-from-square', onClick: handleShare },
  ];

  if (isOwner) {
    menuItems.push(
      { label: 'Delete', icon: 'fa-trash-can', onClick: handleDelete, variant: 'danger' }
    );
  }

  return (
    <div
      onClick={() => navigate(`/env-home-page/${title}`)}
 className="bg-[#111827] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer group"
    >
      {/* Cover Image */}
      <div className="relative h-36 overflow-hidden">
        <ImageWithFallback
          src={
            avatar ||
            'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>

        {isJoined && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Joined
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu
              items={menuItems}
              trigger={
                <Button variant="ghost" size="icon" borderRadius="rounded-lg" className="h-6 w-6">
                  <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                </Button>
              }
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{description}</p>

        {/* Member avatars */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[
              'https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg',
              'https://leerob.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Favatar.b1d1472f.jpg&w=256&q=75',
              'https://nextjs.org/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F35255%2F1665059775-delba.jpg&w=640&q=75',
            ].map((src, i) => (
              <ImageWithFallback
                key={i}
                variant="avatar"
                src={src}
                alt=""
                className="h-7 w-7 rounded-full ring-2 ring-[#111827] object-cover"
              />
            ))}
            <div className="h-7 w-7 rounded-full ring-2 ring-[#111827] bg-[#1a2540] flex items-center justify-center">
              <span className="text-[9px] font-bold text-slate-400">+</span>
            </div>
          </div>

          <SpaceJoinButton
            title={title}
            initialIsJoined={isJoined}
            className="text-xs font-semibold px-4 py-1.5 rounded-xl transition-all duration-200"
            joinedClassName="bg-[#1a2540] text-slate-300 hover:text-red-400"
            unjoinedClassName="bg-indigo-600 hover:bg-indigo-500 text-white"
          />
        </div>
      </div>
    </div>
  );
}
