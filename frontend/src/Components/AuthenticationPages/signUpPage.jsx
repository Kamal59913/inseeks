import { useState } from 'react'
import axios from 'axios'
import { FormField } from '../Common/FormFields'
import { PasswordField } from '../Common/PasswordField'
import { useAppForm } from '../../hooks/useAppForm'
import { signUpSchema } from '../../utils/formSchemas'
import { preprocessTrimmedFormData } from '../../utils/formValidation'

export default function SignUpPage(props) {
  const sinupUrl = `${process.env.REACT_APP_API_URL}/users/register`
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { control, handleSubmit, reset } = useAppForm({
    schema: signUpSchema,
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      password: '',
    },
  })

  const handleSignUp = (values) => {
    setLoading(true)
    setError('')
    axios.post(sinupUrl, preprocessTrimmedFormData(values), { withCredentials: true })
      .then(res => {
        if (res.data.statusCode === 200 && res.data.success) {
          setSuccess(true)
          reset()
          setTimeout(() => props.togglepage(), 1500)
        }
      })
      .catch(() => setError('Registration failed. Please try again.'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-[#090e1a] flex">
      {/* Left Hero */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-[#0f172a] to-[#090e1a]"></div>
        <div className="absolute top-1/3 -left-10 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 h-60 w-60 rounded-full bg-indigo-600/15 blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <i className="fa-solid fa-seedling text-white text-sm"></i>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Inseeks</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Start your<br/>
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">journey today.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Join the fastest growing community of creators and professionals. Share ideas, grow your network, and discover amazing content.
          </p>

          <div className="space-y-3">
            {[
              { icon: 'fa-check-circle', text: 'Free forever. No credit card required.' },
              { icon: 'fa-check-circle', text: 'Connect with professionals worldwide.' },
              { icon: 'fa-check-circle', text: 'Join communities that match your interests.' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <i className={`fa-solid ${f.icon} text-indigo-400 text-sm`}></i>
                <span className="text-slate-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-600">© 2024 Inseeks. All rights reserved.</div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-sm"></i>
            </div>
            <span className="text-white font-bold text-xl">Inseeks</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">Create an account</h2>
            <p className="text-slate-400 mt-2 text-sm">It's free and only takes a minute</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-sm"></i>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
              <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
              <p className="text-emerald-400 text-sm">Account created! Redirecting to login…</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="fullname"
                label="Full Name"
                placeholder="John Doe"
                maxLength={80}
                disabled={loading || success}
              />
              <FormField
                control={control}
                name="username"
                label="Username"
                placeholder="johndoe"
                maxLength={40}
                disabled={loading || success}
              />
            </div>

            <FormField
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
              maxLength={150}
              disabled={loading || success}
            />

            <PasswordField
              control={control}
              name="password"
              label="Password"
              placeholder="Create a strong password"
              maxLength={64}
              disabled={loading || success}
            />

            <button
              type="submit" disabled={loading || success}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Creating account…</> : <><span>Create Account</span><i className="fa-solid fa-arrow-right text-sm"></i></>}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1f2e47]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#090e1a] px-4 text-slate-500">or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'fa-google', label: 'Google' },
              { icon: 'fa-github', label: 'GitHub' },
              { icon: 'fa-twitter', label: 'Twitter' },
            ].map(s => (
              <button key={s.label} className="flex items-center justify-center gap-2 bg-[#111827] border border-[#2a3d5c] hover:border-[#3d4f6b] text-slate-300 py-2.5 rounded-xl text-sm font-medium transition-all">
                <i className={`fa-brands ${s.icon}`}></i>
                <span className="hidden sm:inline text-xs">{s.label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <button type="button" onClick={props.togglepage} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
