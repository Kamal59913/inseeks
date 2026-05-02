import React from 'react';
import ContextMenu, { ContextMenuItem } from '../Common/ContextMenu';
import Button from '../Common/Button';
import { useModalData } from '../../store/hooks';
import { copyToClipboard } from '../../utils/clipboardUtils';
import { postService } from '../../services/post.service';
import { useQueryClient } from '@tanstack/react-query';

interface PostOptionsMenuProps {
  postId: string;
  postType: string;
  authorUsername: string;
  currentUsername?: string;
  postData?: any;
}

export default function PostOptionsMenu({
  postId,
  postType,
  authorUsername,
  currentUsername,
  postData,
}: PostOptionsMenuProps) {
  const modal = useModalData();
  const queryClient = useQueryClient();
  const isOwnPost = currentUsername && authorUsername === currentUsername;

  const handleShare = () => {
    copyToClipboard(`${window.location.origin}/post/${postId}`);
  };

  const handleDelete = () => {
    modal.open('confirm-delete' as any, {
      title: 'Delete Post',
      description: 'Are you sure you want to delete this post? This action cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        try {
          await postService.deletePost(postId);
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        } catch (err) {
          console.error('Failed to delete post:', err);
        }
      },
    });
  };

  const handleEdit = () => {
    modal.open('edit-post' as any, {
      postId,
      postType,
      postData: postData || { title: '', description: '' },
    });
  };

  const items: ContextMenuItem[] = [
    {
      label: 'Share',
      icon: 'fa-share-from-square',
      onClick: handleShare,
    },
  ];

  if (isOwnPost) {
    items.push(
      {
        label: 'Edit',
        icon: 'fa-pen',
        onClick: handleEdit,
      },
      {
        label: 'Delete',
        icon: 'fa-trash-can',
        onClick: handleDelete,
        variant: 'danger',
      }
    );
  }

  return (
    <ContextMenu
      items={items}
      trigger={
        <Button variant="ghost" size="icon" borderRadius="rounded-lg">
          <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
        </Button>
      }
    />
  );
}
