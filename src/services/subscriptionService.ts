import { SubscriptionPlan, PaymentSettings, SubscriptionOrder, UserVIPStatus } from '../types/drama';

const PLANS_STORAGE_KEY = 'free_drama_vip_plans';
const PAYMENT_STORAGE_KEY = 'free_drama_payment_settings';
const ORDERS_STORAGE_KEY = 'free_drama_vip_orders';
const USER_VIP_STORAGE_KEY = 'free_drama_user_vip_status';

export const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-weekly',
    name: 'Weekly VIP (সাপ্তাহিক)',
    nameBn: 'সাপ্তাহিক ভিআইপি',
    price: 49,
    currency: '৳',
    durationDays: 7,
    features: [
      'সব ভিআইপি এপিসোড আনলক',
      'সম্পূর্ণ বিজ্ঞাপনমুক্ত স্ট্রিমিং',
      'এইচডি কোয়ালিটি ভিডিও',
      '৭ দিনের আনলিমিটেড অ্যাক্সেস'
    ]
  },
  {
    id: 'plan-monthly',
    name: 'Monthly VIP (মাসিক)',
    nameBn: 'মাসিক ভিআইপি',
    price: 149,
    currency: '৳',
    durationDays: 30,
    badge: 'জনপ্রিয় (Popular)',
    features: [
      'সব ভিআইপি ড্রামা ও এপিসোড আনলক',
      'সম্পূর্ণ বিজ্ঞাপনমুক্ত অভিজ্ঞতা',
      '৪K আল্ট্রা এইচডি ভিডিও কোয়ালিটি',
      'নতুন রিলিজ সবার আগে দেখার সুবিধা',
      '৩০ দিনের আনলিমিটেড অ্যাক্সেস'
    ]
  },
  {
    id: 'plan-yearly',
    name: 'Yearly VIP (বার্ষিক)',
    nameBn: 'বার্ষিক ভিআইপি',
    price: 999,
    currency: '৳',
    durationDays: 365,
    badge: 'সেরা অফার (Best Value)',
    features: [
      '৩৬৫ দিন সম্পূর্ণ ভিআইপি অ্যাক্সেস',
      '১০০% বিজ্ঞাপনমুক্ত নো-বাফারিং',
      'সব এক্সক্লুসিভ ড্রামা এক ক্লিকে আনলক',
      'ভিআইপি প্রায়োরিটি সাপোর্ট'
    ]
  }
];

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  bkashNumber: '01712345678',
  bkashType: 'Personal',
  nagadNumber: '01912345678',
  nagadType: 'Personal',
  instructionsBn: 'আপনার বিকাশ বা নগদ অ্যাপ থেকে ওপরের নম্বরে Send Money করুন। সফলভাবে টাকা পাঠানোর পর আপনার প্রেরক মোবাইল নম্বর ও TrxID (Transaction ID) নিচে দিয়ে সাবমিট করুন।',
  instructionsEn: 'Send Money to the above bKash or Nagad number. After sending, enter your sender phone number and Transaction ID (TrxID) below to activate VIP instantly.',
  enabled: true
};

export function getStoredSubscriptionPlans(): SubscriptionPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_SUBSCRIPTION_PLANS;
}

export function saveStoredSubscriptionPlans(plans: SubscriptionPlan[]): void {
  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
}

export function getStoredPaymentSettings(): PaymentSettings {
  try {
    const raw = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PAYMENT_SETTINGS;
}

export function saveStoredPaymentSettings(settings: PaymentSettings): void {
  localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(settings));
}

export function getStoredSubscriptionOrders(): SubscriptionOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [
    {
      id: 'order-sample-1',
      planId: 'plan-monthly',
      planName: 'Monthly VIP (মাসিক)',
      amount: 149,
      paymentMethod: 'bkash',
      senderNumber: '01798765432',
      transactionId: 'BL98K23N09',
      status: 'approved',
      createdAt: new Date().toISOString()
    }
  ];
}

export function saveStoredSubscriptionOrders(orders: SubscriptionOrder[]): void {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function submitSubscriptionOrder(
  plan: SubscriptionPlan,
  paymentMethod: 'bkash' | 'nagad',
  senderNumber: string,
  transactionId: string
): SubscriptionOrder {
  const newOrder: SubscriptionOrder = {
    id: `order-${Date.now()}`,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    paymentMethod,
    senderNumber,
    transactionId,
    status: 'approved', // Instant VIP activation for seamless user experience
    createdAt: new Date().toISOString()
  };

  const existing = getStoredSubscriptionOrders();
  existing.unshift(newOrder);
  saveStoredSubscriptionOrders(existing);

  // Grant VIP status to current user
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

  const vipStatus: UserVIPStatus = {
    isVIP: true,
    planName: plan.name,
    expiresAt: expiresAt.toISOString(),
    transactionId
  };
  setUserVIPStatus(vipStatus);

  return newOrder;
}

export function getUserVIPStatus(): UserVIPStatus {
  try {
    const raw = localStorage.getItem(USER_VIP_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return { isVIP: false };
}

export function setUserVIPStatus(status: UserVIPStatus): void {
  localStorage.setItem(USER_VIP_STORAGE_KEY, JSON.stringify(status));
}
