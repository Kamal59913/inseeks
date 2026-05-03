import React, { useState, useRef } from 'react';
import { useModalData } from '../../store/hooks';
import { envService } from '../../services/env.service';
import { useQueryClient } from '@tanstack/react-query';
import AppModal from './AppModal';
import Button from '../Common/Button';
import { queryKeys } from '../../hooks/queryKeys';
import ImageWithFallback from '../Common/ImageWithFallback';

interface EditSpaceModalProps {
  modalId: string;
  data: {
    envname: string;
    description: string;
    avatar?: string;
  };
}

const EditSpaceModal: React.FC<EditSpaceModalProps> = ({ modalId, data }) => {
  const { close } = useModalData();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState(data.description || '');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('EnvDescription', description);
      if (coverImage) {
        formData.append('envCoverImage', coverImage);
      }

      await envService.updateEnvironment(data.envname, formData);
      queryClient.invalidateQueries({ queryKey: queryKeys.environments });
      queryClient.invalidateQueries({ queryKey: queryKeys.envPosts(data.envname, 'explore') }); // invalidating general space posts
      close();
    } catch (err: any) {
      console.error('Failed to update space:', err);
      setError(err?.response?.data?.message || 'Failed to update space.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppModal onClose={() => close()} contentClassName="max-w-2xl mx-auto">
      <div className="p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Edit Space</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Space Name
            </label>
            <input
              type="text"
              value={data.envname}
              disabled
              className="w-full bg-[#0a101d] border border-[#1f2e47]/50 rounded-xl px-4 py-3 text-sm text-slate-500 outline-none cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Space names cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#0d1526] border border-[#1f2e47] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none"
              placeholder="What is this space about?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Cover Image
            </label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden bg-[#0d1526] border border-[#1f2e47] shrink-0">
                {coverImage ? (
                  <img src={URL.createObjectURL(coverImage)} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageWithFallback src={data.avatar || 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'} alt="Current cover" className="h-full w-full object-cover" />
                )}
              </div>
              <Button
                variant="custom"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-[#1b2742] field-subtle border border-[#1f2e47]"
              >
                Change Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
              {error}
            </div>
          )}
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

export default EditSpaceModal;
