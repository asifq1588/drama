import React, { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink, Globe } from 'lucide-react';
import { Drama } from '../types/drama';
import { generateBloggerIframeCode, generateStandaloneBloggerTemplateCode } from '../services/bloggerExport';

interface BloggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDrama?: Drama | null;
}

export const BloggerModal: React.FC<BloggerModalProps> = ({
  isOpen,
  onClose,
  selectedDrama,
}) => {
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [tab, setTab] = useState<'iframe' | 'full'>('iframe');

  if (!isOpen) return null;

  const iframeCode = generateBloggerIframeCode(window.location.origin);
  const templateCode = generateStandaloneBloggerTemplateCode();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121420] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-white text-base">
              ব্লগার (Blogger / Blogspot) কোড এক্সপোর্ট
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-xs text-slate-300">
            এই কোডটি কপি করে আপনার Blogger সাইটের যেকোনো পোস্ট বা পেজের HTML ভিউতে পেস্ট করে দিলেই আপনার পুরো &quot;ফ্রি ড্রামা&quot; প্ল্যাটফর্ম লাইভ চলবে!
          </p>

          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setTab('iframe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                tab === 'iframe'
                  ? 'bg-[#ff2a5f] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              রেসপন্সিভ এম্বেড কোড (Responsive Iframe)
            </button>
            <button
              onClick={() => setTab('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                tab === 'full'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              স্ট্যান্ডঅ্যালোন HTML টেমপ্লেট
            </button>
          </div>

          {tab === 'iframe' ? (
            <div className="space-y-3">
              <div className="bg-[#0a0b0f] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                <pre>{iframeCode}</pre>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  যে কোনো Blogger থিম এবং মোবাইল স্ক্রিনে ১০০% কাজ করবে।
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(iframeCode);
                    setCopiedIframe(true);
                    setTimeout(() => setCopiedIframe(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#ff2a5f] hover:bg-[#e11d48] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedIframe ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedIframe ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-[#0a0b0f] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                <pre>{templateCode}</pre>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Blogger Theme &gt; Edit HTML এ সরাসরি ব্যবহারযোগ্য।
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(templateCode);
                    setCopiedTemplate(true);
                    setTimeout(() => setCopiedTemplate(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedTemplate ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTemplate ? 'কপি হয়েছে!' : 'HTML কপি করুন'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
