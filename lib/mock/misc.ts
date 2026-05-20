import type {
  Blog,
  Branch,
  Insights,
  NotificationItem,
  PaymentMethod,
} from "@/lib/types";

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    icon: "credit-card",
    title: "Payment Reminder",
    body: "Your SME loan installment of $162.50 is due in 3 days.",
    time: "2h ago",
    unread: true,
    category: "payment",
  },
  {
    id: "n2",
    icon: "check-circle",
    title: "Loan Approved",
    body: "Your Housing Loan of $8,000 has been approved. Funds will be disbursed within 24 hours.",
    time: "1 day ago",
    unread: true,
    category: "loan",
  },
  {
    id: "n3",
    icon: "bell",
    title: "New Feature",
    body: "You can now pay your installments via Bakong KHQR directly from the app.",
    time: "3 days ago",
    unread: false,
    category: "news",
  },
  {
    id: "n4",
    icon: "calendar",
    title: "Branches closed for Khmer New Year",
    body: "All Weloan365 branches will be closed Apr 14–16. The app stays open as usual.",
    time: "Apr 15",
    unread: false,
    category: "news",
  },
  {
    id: "n5",
    icon: "shield",
    title: "Security Alert",
    body: "New login detected from Samsung Galaxy S24. If this wasn't you, please review your account.",
    time: "Apr 10",
    unread: false,
    category: "security",
  },
];

export const branches: Branch[] = [
  { id: "b1", name: "Weloan365 HQ — Phnom Penh", address: "#123, St. 271, Sangkat Toul Tumpung, Phnom Penh", phone: "+855 23 987 654", distance: "1.2 km", hours: "8:00 AM – 5:30 PM" },
  { id: "b2", name: "Siem Reap Branch", address: "Pokambor Ave, Sala Kamreuk, Siem Reap", phone: "+855 63 765 432", distance: "314 km", hours: "8:30 AM – 5:00 PM" },
  { id: "b3", name: "Battambang Branch", address: "St. 1, Svay Por, Battambang", phone: "+855 53 123 456", distance: "292 km", hours: "8:30 AM – 5:00 PM" },
  { id: "b4", name: "Sihanoukville Branch", address: "Ekareach St, Commune 3, Sihanoukville", phone: "+855 34 111 222", distance: "230 km", hours: "8:30 AM – 5:00 PM" },
];

export const blogs: Blog[] = [
  { id: "bl1", title: "How to improve your credit score in 2026", excerpt: "Five simple habits that can boost your credit score within 6 months...", readTime: "5 min", date: "Apr 20, 2026", cover: "a", icon: "trending-up" },
  { id: "bl2", title: "Understanding EMI: a beginner's guide", excerpt: "What is EMI, how is it calculated, and why it matters for your loan...", readTime: "4 min", date: "Apr 15, 2026", cover: "b", icon: "calculator" },
  { id: "bl3", title: "Smart ways to use a business loan", excerpt: "Turn your capital into growth with these proven strategies...", readTime: "7 min", date: "Apr 08, 2026", cover: "c", icon: "briefcase" },
  { id: "bl4", title: "Top 5 mistakes first-time borrowers make", excerpt: "Avoid these common pitfalls and save money on your first loan...", readTime: "3 min", date: "Apr 01, 2026", cover: "d", icon: "alert-triangle" },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "pm1", name: "Bakong KHQR", icon: "qr-code", subtitle: "Scan QR with any bank app", color: "#e53e3e" },
  { id: "pm2", name: "ABA Pay", icon: "credit-card", subtitle: "Redirect to ABA Mobile", color: "#1a4fd4" },
  { id: "pm3", name: "ACLEDA Mobile", icon: "smartphone", subtitle: "Open ACLEDA app to pay", color: "#0a7e3a" },
  { id: "pm4", name: "Wing", icon: "wallet", subtitle: "Pay via Wing money", color: "#00897b" },
];

export const insights: Insights = {
  score: 742,
  grade: "Good",
  eligibleAmount: 12000,
  monthlyObligation: 402.5,
  spendingBreakdown: [
    { label: "Loan Repayments", value: 402.5, color: "#1f5fff" },
    { label: "Utilities", value: 85, color: "#00c48c" },
    { label: "Other", value: 120, color: "#ff9f1c" },
  ],
  tips: [
    "Pay your installments on time to maintain your credit score",
    "Keep total debt below 30% of your monthly income",
    "You qualify for business loans — check eligibility",
  ],
};
