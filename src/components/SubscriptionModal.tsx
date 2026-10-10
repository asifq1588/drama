import React, { useState } from 'react';
import {
  X,
  Crown,
  Check,
  Copy,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { SubscriptionPlan, PaymentSettings, UserVIPStatus, AppLanguage } from '../types/drama';
import {
  getStoredSubscriptionPlans,
  getStoredPaymentSettings,
  getUserVIPStatus,
  submitSubscriptionOrder
} from '../services/subscriptionService';
import { TRANSLATIONS } from '../services/i18n';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVIPActivated: () => void;
  appLanguage: AppLanguage;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onVIPActivated,
  appLanguage,
}) => {
  const t = TRANSLATIONS[appLanguage];
  const plans = getStoredSubscriptionPlans();
  const paymentSettings = getStoredPaymentSettings();
  const currentVIP = getUserVIPStatus();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(plans[1] || plans[0]);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successActivated, setSuccessActivated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const currentNumber = paymentMethod === 'bkash' ? paymentSettings.bkashNumber : paymentSettings.nagadNumber;
  const currentAccountType = paymentMethod === 'bkash' ? paymentSettings.bkashType : paymentSettings.nagadType;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleConfirmSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!senderNumber.trim() || senderNumber.trim().length < 10) {
      setErrorMessage(appLanguage === 'bn' ? 'সঠিক প্রেরক মোবাইল নম্বর দিন (যেমন: 01712345678)' : 'Please enter a valid sender phone number');
      return;
    }

    if (!transactionId.trim() || transactionId.trim().length < 4) {
      setErrorMessage(appLanguage === 'bn' ? 'টাকা পাঠানোর পর প্রাপ্ত TrxID (Transaction ID) দিন' : 'Please enter the Transaction ID (TrxID)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitSubscriptionOrder(selectedPlan, paymentMethod, senderNumber.trim(), transactionId.trim());
      setIsSubmitting(false);
      setSuccessActivated(true);
      onVIPActivated();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121420] border border-amber-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-6">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-[#121420] to-rose-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Crown className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                <span>{appLanguage === 'bn' ? 'প্রিমিয়াম ভিআইপি সাবস্ক্রিপশন' : appLanguage === 'hi' ? 'प्रीमियम वीआईपी सदस्यता' : 'Premium VIP Subscription'}</span>
              </h3>
              <p className="text-xs text-amber-300/80 font-medium">
                {appLanguage === 'bn' ? 'বিজ্ঞাপনমুক্ত ফুল এইচডি ড্রামা ও সব পর্ব আনলক' : 'Ad-free full HD drama & all episodes unlocked'}
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {successActivated ? (
            /* Success State */
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h4 className="text-xl font-black text-white">
                {appLanguage === 'bn' ? '🎉 অভিনন্দন! আপনার ভিআইপি সক্রিয় হয়েছে!' : '🎉 Congratulations! Your VIP is Active!'}
              </h4>
              <p className="text-slate-300 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
                {appLanguage === 'bn'
                  ? `আপনার "${selectedPlan.name}" সফলভাবে যুক্ত হয়েছে। এখন থেকে সব পর্ব সম্পূর্ণ বিজ্ঞাপন ছাড়া উপভোগ করুন!`
                  : `Your "${selectedPlan.name}" has been activated. Enjoy all episodes completely ad-free!`}
              </p>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform cursor-pointer"
                >
                  {appLanguage === 'bn' ? 'ড্রামা দেখা শুরু করুন' : 'Start Watching Now'}
                </button>
              </div>
            </div>
          ) : currentVIP.isVIP ? (
            /* Already VIP Status */
            <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/40 rounded-2xl p-5 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs">
                <Crown className="w-4 h-4 fill-amber-300" />
                <span>ভিআইপি মেম্বারশিপ সক্রিয় (VIP Active)</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                {currentVIP.planName || 'Premium VIP Member'}
              </h4>
              <p className="text-slate-300 text-xs">
                মেয়াদ শেষ হবে: {currentVIP.expiresAt ? new Date(currentVIP.expiresAt).toLocaleDateString('bn-BD') : 'Active'}
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  ঠিক আছে (Continue)
                </button>
              </div>
            </div>
          ) : (
            /* Purchase Flow */
            <>
              {/* Step 1: Choose Plan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>১. প্ল্যান নির্বাচন করুন (Select Plan):</span>
                  <span className="text-[11px] text-amber-400 font-normal">১০০% মানিব্যাক গ্যারান্টি</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id;
                    return (
                      <button
                        type="button"
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-500/20 to-rose-500/10 border-amber-500 shadow-lg shadow-amber-500/20'
                            : 'bg-[#151722] border-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-[9px] uppercase tracking-wider shadow">
                            {plan.badge}
                          </span>
                        )}

                        <div>
                          <h4 className="font-bold text-white text-xs sm:text-sm">
                            {plan.name}
                          </h4>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-xl sm:text-2xl font-black text-amber-400">
                              {plan.currency}{plan.price}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              /{plan.durationDays} দিন
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/5 space-y-1 text-[10px] text-slate-400">
                          {plan.features.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 truncate">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Payment Method (bKash & Nagad) */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-slate-300 font-bold block">
                  ২. পেমেন্ট মেথড নির্বাচন করুন (Payment Method):
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {/* bKash Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'bg-[#e2136e]/20 border-[#e2136e] shadow-lg shadow-[#e2136e]/20'
                        : 'bg-[#151722] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#e2136e] flex items-center justify-center font-black text-white text-xs">
                        বি
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-white text-sm">bKash (বিকাশ)</div>
                        <div className="text-[10px] text-slate-400">{paymentSettings.bkashType}</div>
                      </div>
                    </div>
                    {paymentMethod === 'bkash' && (
                      <div className="w-5 h-5 rounded-full bg-[#e2136e] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>

                  {/* Nagad Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'bg-[#f7941d]/20 border-[#f7941d] shadow-lg shadow-[#f7941d]/20'
                        : 'bg-[#151722] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#f7941d] flex items-center justify-center font-black text-slate-950 text-xs">
                        ন
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-white text-sm">Nagad (নগদ)</div>
                        <div className="text-[10px] text-slate-400">{paymentSettings.nagadType}</div>
                      </div>
                    </div>
                    {paymentMethod === 'nagad' && (
                      <div className="w-5 h-5 rounded-full bg-[#f7941d] flex items-center justify-center">
                        <Check className="w-3 h-3 text-slate-950" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Number Box with 1-click Copy */}
                <div className="bg-[#0b0c10] p-4 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">
                      {paymentMethod === 'bkash' ? 'বিকাশ নম্বর (Send Money):' : 'নগদ নম্বর (Send Money):'}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10">
                      {currentAccountType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-[#151722] px-4 py-2.5 rounded-xl border border-white/5">
                    <span className="text-base sm:text-lg font-black text-white tracking-wider font-mono">
                      {currentNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#ff2a5f] text-white font-bold transition-all cursor-pointer"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    {appLanguage === 'bn' ? paymentSettings.instructionsBn : paymentSettings.instructionsEn}
                  </p>
                </div>
              </div>

              {/* Step 3: Transaction Info Input Form */}
              <form onSubmit={handleConfirmSubscription} className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-slate-300 font-bold block">
                  ৩. পেমেন্টের তথ্য দিন (Payment Verification):
                </span>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">
                      যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Mobile):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="017XXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full bg-[#0b0c10] text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">
                      Transaction ID (TrxID):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="BL98K23N09"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-[#0b0c10] text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-[#ff2a5f] hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Crown className="w-4 h-4 fill-slate-950" />
                    <span>
                      {isSubmitting
                        ? 'যাচাই করা হচ্ছে...'
                        : `৳ ${selectedPlan.price} পরিশোধ করে ভিআইপি সক্রিয় করুন`}
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
