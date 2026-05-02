import React, { useState } from 'react';
import { useModalData } from '../../store/hooks';
import { postService } from '../../services/post.service';
import { useQueryClient } from '@tanstack/react-query';
import AppModal from './AppModal';
import Button from '../Common/Button';

interface EditPostModalProps {
  modalId: string;
  data: {
    postId: string;
    postType: string;
    postData: {
      title?: string;
      description?: string;
    };
  };
}

const EditPostModal: React.FC<EditPostModalProps> = ({ modalId, data }) => {
  const { close } = useModalData();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(data?.postData?.title || '');
  const [description, setDescription] = useState(data?.postData?.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await postService.updatePost(data.postId, { title, description });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      close();
    } catch (err) {
      console.error('Failed to update post:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppModal onClose={() => close()} contentClassName="max-w-2xl mx-auto">
      <div className="p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Edit Post</h3>

        <div className="space-y-5">
          {/* Title field — hidden for video posts that don't use titles */}
          {data?.postType !== 'video' && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0d1526] border border-[#1f2e47] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder="Post title..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-[#0d1526] border border-[#1f2e47] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none"
              placeholder="Write something..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 justify-end">
          <Button
            variant="custom"
            onClick={() => close()}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-[#1b2742] field-subtle"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            loadingState={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </AppModal>
  );
};

export default EditPostModal;
