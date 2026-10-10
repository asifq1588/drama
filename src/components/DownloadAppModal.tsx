import React from 'react';
import { X, Smartphone, Download, QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121420] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base">
              ফ্রি ড্রামা অ্যাপ ডাউনলোড (Free Drama App)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center space-y-5">
          {/* App Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#ff2a5f] to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-[#ff2a5f]/30">
            <span className="text-2xl font-black text-white">FD</span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">ফ্রি ড্রামা (Free Drama)</h4>
            <p className="text-xs text-slate-300 mt-1">
              সম্পূর্ণ ফ্রিতে দেখুন সব ধরণের হিন্দি, বাংলা ও ডাবড শর্ট ড্রামা
            </p>
          </div>

          {/* Features */}
          <div className="bg-[#0c0d12] p-4 rounded-xl text-left text-xs space-y-2 border border-white/5">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>এইচডি কোয়ালিটি ও দ্রুত বাফারিং</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ভার্টিক্যাল রিলস স্টাইল প্লেয়ার</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
              <span>১০০% নিরাপদ ও বিজ্ঞাপনমুক্ত অভিজ্ঞতা</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                alert('অ্যাপ ডাউনলোড লিংক সফলভাবে জেনারেট হয়েছে!');
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff2a5f] to-rose-600 hover:from-[#ff1a53] hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>অ্যান্ড্রয়েড APK ডাউনলোড (Download APK)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
            >
              ব্রাউজারে দেখা চালিয়ে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
