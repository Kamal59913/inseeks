import React, { useEffect, useState } from 'react';
import LeftBar from '../Utilities/LeftBar';
import SearchBar from '../Utilities/SearchBar';
import { FormField, FormTextarea } from '../Common/FormFields';
import Button from '../Common/Button';
import { useAppForm } from '../../hooks/useAppForm';
import { profileSettingsSchema } from '../../validations/schemas/profile.schema';
import { preprocessTrimmedFormData } from '../../utils/formValidation';
import { useModalData } from '../../store/hooks';
import ImageWithFallback from '../Common/ImageWithFallback';
import PageLoader from '../Common/PageLoader';
import { useCurrentUserQuery, useUpdateUserMutation } from '../../hooks/useCurrentUserQuery';

function MyProfileSettings() {
  const modal = useModalData();
  const fallback =
    'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png';

  const [profilepicture, setProfilepicturetoggle] = useState(false);

  const { data: currentUser, isLoading } = useCurrentUserQuery();
  const updateMutation = useUpdateUserMutation();

  const { control, handleSubmit, reset } = useAppForm({
    schema: profileSettingsSchema,
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      about: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        fullname: currentUser.fullname || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        about: currentUser.about || '',
      });
    }
  }, [currentUser, reset]);

  const toggleForProfileImageFetch = () => setProfilepicturetoggle((value) => !value);

  const handlesubmit = (values: Record<string, unknown>) => {
    updateMutation.mutate(preprocessTrimmedFormData(values) as any, {
      onSuccess: () => {
        reset();
        toggleForProfileImageFetch();
        setTimeout(() => updateMutation.reset(), 2000);
      },
    });
  };

  const buttonname = updateMutation.isPending
    ? 'Saving...'
    : updateMutation.isSuccess
    ? 'Saved! ✓'
    : 'Save Changes';

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar />

        <div className="max-w-3xl mx-auto w-full px-4 py-6">
          <div className="bg-[#111827] rounded-2xl overflow-hidden mb-6">
            {/* Header Gradient matching Profile page */}
            <div className="h-32 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-[#111827] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent"></div>
            </div>

            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <ImageWithFallback
                    variant="avatar"
                    src={currentUser?.avatar || fallback}
                    alt="avatar"
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#090e1a] bg-[#1a2540]"
                  />
                  <div className="pb-1">
                    <h1 className="text-xl font-bold text-white">Edit Profile</h1>
                    <p className="text-sm text-slate-400">@{currentUser?.username || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pb-1">
                  <Button
                    onClick={() =>
                      modal.open('replace-avatar', { onComplete: toggleForProfileImageFetch })
                    }
                    size="sm"
                    startIcon={<i className="fa-solid fa-arrow-up-from-bracket text-xs"></i>}
                  >
                    Replace
                  </Button>
                  <Button
                    variant="custom"
                    size="icon"
                    onClick={() =>
                      modal.open('delete-avatar', { onComplete: toggleForProfileImageFetch })
                    }
                    className="flex items-center justify-center h-9 w-9 bg-transparent border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400"
                    title="Remove Photo"
                  >
                    <i className="fa-regular fa-trash-can text-xs"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">
              Profile Information
            </h2>
            <form onSubmit={handleSubmit(handlesubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={control}
                  name="fullname"
                  label="Full Name"
                  placeholder="Full name"
                  maxLength={101}
                />
                <FormField
                  control={control}
                  name="username"
                  label="Username"
                  placeholder="username"
                  maxLength={101}
                />
              </div>
              <FormField
                control={control}
                name="email"
                label="Email"
                type="email"
                placeholder="email@example.com"
                maxLength={151}
              />
              <FormTextarea
                control={control}
                name="about"
                label="About"
                rows={4}
                placeholder="Tell us about yourself..."
                maxLength={281}
              />

              <div className="flex items-center justify-end pt-4">
                <Button
                  type="submit"
                  className="px-8 py-2.5 min-w-[160px]"
                  startIcon={buttonname === 'Saved! ✓' ? <i className="fa-solid fa-check text-xs"></i> : undefined}
                >
                  {buttonname}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyProfileSettings;
