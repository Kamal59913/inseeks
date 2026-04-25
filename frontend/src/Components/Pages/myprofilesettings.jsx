import { useEffect, useState } from 'react';
import LeftBar from '../Utilities/LeftBar';
import axios from 'axios';
import { FormField, FormTextarea } from '../Common/FormFields';
import { useAppForm } from '../../hooks/useAppForm';
import { profileSettingsSchema } from '../../utils/formSchemas';
import { preprocessTrimmedFormData } from '../../utils/formValidation';
import { useModalData } from '../../store/hooks';

const SETTINGS_NAV = [
  { key: 'account', icon: 'fa-circle-user', label: 'My Account' },
  { key: 'notif', icon: 'fa-bell', label: 'Notifications' },
  { key: 'security', icon: 'fa-lock', label: 'Security & Privacy' },
  { key: 'billing', icon: 'fa-credit-card', label: 'Billing' },
  { key: 'help', icon: 'fa-circle-question', label: 'Help & Support' },
]

function MyProfileSettings() {
  const modal = useModalData()
  const updateurl = `${process.env.REACT_APP_API_URL}/users/update-account`
  const currentuser = `${process.env.REACT_APP_API_URL}/users/current-user`
  const fallback = 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png'

  const [profilepicture, setProfilepicturetoggle] = useState(false)
  const [currentUser, setCurrentUser] = useState()
  const [buttonname, setButtonname] = useState('Save Changes')
  const [activeNav, setActiveNav] = useState('account')
  const { control, handleSubmit, reset } = useAppForm({
    schema: profileSettingsSchema,
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      about: '',
    },
  })

  useEffect(() => {
    axios.get(currentuser, { withCredentials: true })
      .then((res) => {
        const nextUser = res.data.data
        setCurrentUser(nextUser)
        reset({
          fullname: nextUser?.fullname || '',
          username: nextUser?.username || '',
          email: nextUser?.email || '',
          about: nextUser?.about || '',
        })
      })
  }, [profilepicture, reset])

  const toggleForProfileImageFetch = () => setProfilepicturetoggle((value) => !value)

  const handlesubmit = (values) => {
    setButtonname('Saving...')
    axios.patch(updateurl, preprocessTrimmedFormData(values), { withCredentials: true })
      .then(() => {
        reset()
        toggleForProfileImageFetch()
        setButtonname('Saved! ✓')
        setTimeout(() => setButtonname('Save Changes'), 2000)
      })
      .catch(() => setButtonname('Save Changes'))
  }

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar/>

      <main className="flex-1 flex min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <aside className="hidden lg:flex flex-col shrink-0 w-56 h-screen border-r border-[#1f2e47] py-8 px-3 gap-1 sticky top-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">Settings</p>
          {SETTINGS_NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                ${activeNav === item.key ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-[#1a2540]'}`}
            >
              <i className={`fa-solid ${item.icon} w-4 text-center`}></i>
              {item.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 px-4 lg:px-8 py-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-white mb-8">Account Settings</h1>

          <div className="bg-[#111827] border border-[#1f2e47] rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Profile Photo</h2>
            <div className="flex items-center gap-5">
              <img
                src={currentUser?.avatar || fallback}
                alt="avatar"
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-[#2a3d5c]"
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => modal.open('replace-avatar', { onComplete: toggleForProfileImageFetch })}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  <i className="fa-solid fa-arrow-up-from-bracket text-xs"></i>
                  Replace Photo
                </button>
                <button
                  type="button"
                  onClick={() => modal.open('delete-avatar', { onComplete: toggleForProfileImageFetch })}
                  className="flex items-center gap-2 bg-transparent border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  <i className="fa-regular fa-trash-can text-xs"></i>
                  Remove Photo
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1f2e47] rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-5">Basic Information</h2>
            <form onSubmit={handleSubmit(handlesubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField control={control} name="fullname" label="Full Name" placeholder="Full name" maxLength={80}/>
                <FormField control={control} name="username" label="Username" placeholder="username" maxLength={40}/>
              </div>
              <FormField control={control} name="email" label="Email" type="email" placeholder="email@example.com" maxLength={150}/>
              <FormTextarea control={control} name="about" label="About" rows={3} placeholder="Tell us about yourself..." maxLength={280}/>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 min-w-[150px] justify-center"
                >
                  {buttonname === 'Saved! ✓' && <i className="fa-solid fa-check text-xs"></i>}
                  {buttonname}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MyProfileSettings;
