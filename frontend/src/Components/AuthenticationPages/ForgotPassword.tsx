import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

type Step = 'email' | 'otp' | 'reset';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await authService.forgotPassword(email);
      if (res.data.success) {
        setStep('otp');
        setSuccessMsg('OTP sent to your email.');
      } else {
        setError('Failed to send OTP.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return setError('OTP is required');

    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await authService.verifyOTP(email, otp);
      if (res.data.success) {
        setStep('reset');
        setSuccessMsg('OTP verified. Please enter your new password.');
      } else {
        setError('Invalid OTP.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return setError('All fields are required');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await authService.resetPassword({ email, otp, newPassword: password });
      if (res.data.success) {
        setSuccessMsg('Password reset successfully. Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('Failed to reset password.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090e1a] flex">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-[#0f172a] to-[#090e1a]"></div>
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
          <h1 className="text-5xl font-bold text-white leading-tight">
            Secure your<br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Account.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Follow the steps to reset your password and get back into your account securely.
          </p>
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
            <button 
              onClick={() => navigate('/')} 
              className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2 mb-4 transition-colors"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to login
            </button>
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
            <p className="text-slate-400 mt-2 text-sm">
              {step === 'email' && 'Enter your email to receive an OTP'}
              {step === 'otp' && `Enter the 6-digit OTP sent to ${email}`}
              {step === 'reset' && 'Enter your new password below'}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-sm"></i>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
              <i className="fa-solid fa-check-circle text-emerald-400 text-sm"></i>
              <p className="text-emerald-400 text-sm">{successMsg}</p>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Sending OTP…</>
                ) : (
                  <><span>Send OTP</span><i className="fa-solid fa-arrow-right text-sm"></i></>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  disabled={loading}
                  className="input-field tracking-widest text-center text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Verifying…</>
                ) : (
                  <><span>Verify OTP</span><i className="fa-solid fa-arrow-right text-sm"></i></>
                )}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  className="input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Resetting…</>
                ) : (
                  <><span>Reset Password</span><i className="fa-solid fa-check text-sm"></i></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
