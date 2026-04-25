import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import SignUpPage from '../AuthenticationPages/signUpPage'
import axios from 'axios'
import { FormField } from '../Common/FormFields'
import { PasswordField } from '../Common/PasswordField'
import { useAppForm } from '../../hooks/useAppForm'
import { loginSchema } from '../../utils/formSchemas'
import { preprocessTrimmedFormData } from '../../utils/formValidation'

export default function LoginPage() {
  const loginUrl = `${process.env.REACT_APP_API_URL}/users/login`
  const navigate  = useNavigate()
  const [toggle, setToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { control, handleSubmit } = useAppForm({
    schema: loginSchema,
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const handleLogin = (values) => {
    setLoading(true)
    setError('')
    const { identifier, password } = preprocessTrimmedFormData(values)
    const normalizedIdentifier = identifier.toLowerCase()

    axios.post(loginUrl, {
      username: normalizedIdentifier.includes('@') ? '' : normalizedIdentifier,
      email: normalizedIdentifier.includes('@') ? normalizedIdentifier : '',
      password,
    }, { withCredentials: true })
      .then(res => {
        if (res.data.statusCode === 200 && res.data.success) navigate('/h')
        else setError('Invalid credentials. Please try again.')
      })
      .catch(() => setError('Login failed. Check your credentials.'))
      .finally(() => setLoading(false))
  }

  if (toggle) return <SignUpPage togglepage={() => setToggle(false)}/>

  return (
    <div className="min-h-screen bg-[#090e1a] flex">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        {/* Gradient BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-[#0f172a] to-[#090e1a]"></div>
        {/* Decorative blobs */}
        <div className="absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 h-60 w-60 rounded-full bg-purple-600/15 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-sm"></i>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Inseeks</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-indigo-300 text-sm font-medium">Join thousands of creators</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Connect. Create.<br/>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Inspire.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            A next-generation social platform for professionals, creators, and communities to share ideas and grow together.
          </p>

          <div className="flex items-center gap-4 pt-2">
            {[
              { num: '10K+', label: 'Users' },
              { num: '500+', label: 'Communities' },
              { num: '50K+', label: 'Posts' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.num}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-600">© 2024 Inseeks. All rights reserved.</div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-sm"></i>
            </div>
            <span className="text-white font-bold text-xl">Inseeks</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="text-slate-400 mt-2 text-sm">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-sm"></i>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <FormField
              control={control}
              name="identifier"
              label="Email or Username"
              placeholder="you@example.com or username"
              maxLength={150}
              disabled={loading}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <PasswordField
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                maxLength={64}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Signing in…</>
              ) : (
                <><span>Sign In</span><i className="fa-solid fa-arrow-right text-sm"></i></>
              )}
            </button>
          </form>

          {/* Social login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1f2e47]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#090e1a] px-4 text-slate-500">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'fa-google', label: 'Google' },
              { icon: 'fa-github', label: 'GitHub' },
              { icon: 'fa-twitter', label: 'Twitter' },
            ].map(s => (
              <button
                key={s.label}
                className="flex items-center justify-center gap-2 bg-[#111827] border border-[#2a3d5c] hover:border-[#3d4f6b] text-slate-300 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                <i className={`fa-brands ${s.icon}`}></i>
                <span className="hidden sm:inline text-xs">{s.label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <button type="button" onClick={() => setToggle(true)} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Create a free account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
