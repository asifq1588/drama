import React, { useState } from 'react';
import { X, Shield, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { verifyAdminLogin, setAdminLoggedInSession } from '../services/adminAuthService';
import { AppLanguage } from '../types/drama';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  appLanguage: AppLanguage;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  appLanguage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const isValid = verifyAdminLogin(email, password);
      setIsLoading(false);

      if (isValid) {
        setAdminLoggedInSession(true);
        onLoginSuccess();
        onClose();
      } else {
        setErrorMessage(
          appLanguage === 'bn'
            ? 'ভুল ইমেইল অথবা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।'
            : appLanguage === 'hi'
            ? 'गलत ईमेल या पासवर्ड! कृपया सही जानकारी दें।'
            : 'Invalid email or password! Please enter correct credentials.'
        );
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121420] border border-rose-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-950/40 via-[#121420] to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff2a5f] to-rose-600 flex items-center justify-center shadow-lg shadow-[#ff2a5f]/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">
                {appLanguage === 'bn' ? 'অ্যাডমিন সিকিউরিটি লগইন' : appLanguage === 'hi' ? 'एडमिन सुरक्षा लॉगिन' : 'Admin Security Login'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {appLanguage === 'bn' ? 'সুরক্ষিত কন্ট্রোল প্যানেল' : 'Protected Control Panel'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed text-xs">
            {appLanguage === 'bn'
              ? 'অ্যাডমিন প্যানেলে প্রবেশ করতে আপনার অনুমোদিত ইমেইল এবং পাসওয়ার্ড প্রদান করুন।'
              : 'Enter your authorized email and password to access the Admin Panel.'}
          </p>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {appLanguage === 'bn' ? 'অ্যাডমিন ইমেইল (Admin Email):' : 'Admin Email:'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="asifyt265@gmail.com"
                className="w-full bg-[#0a0b0f] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#ff2a5f] font-mono text-xs"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {appLanguage === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড (Admin Password):' : 'Admin Password:'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0b0f] text-white pl-10 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#ff2a5f] font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff2a5f] to-rose-600 hover:from-[#e11d48] hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-[#ff2a5f]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              <span>
                {isLoading
                  ? (appLanguage === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...')
                  : (appLanguage === 'bn' ? 'লগইন করুন (Login to Admin)' : 'Login to Admin')}
              </span>
            </button>
          </div>

          <div className="text-center pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Protected with SHA-256 Authentication</span>
          </div>
        </form>
      </div>
    </div>
  );
};
