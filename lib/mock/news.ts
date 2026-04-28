import type { NewsItem } from "@/lib/types";

export const newsItems: NewsItem[] = [
  {
    id: "n-2026-04-25",
    category: "announcement",
    title: "Public holiday — Khmer New Year",
    excerpt:
      "All branches will be closed from April 14 to April 16. The app stays open 24/7.",
    body: "All Weloan365 branches will be closed for Khmer New Year from Tuesday April 14 to Thursday April 16, 2026. Online services and the mobile app continue to operate as usual — you can apply for a loan, simulate EMI, and make repayments anytime.\n\nFor urgent matters, please contact +855 23 987 654 from April 17 onwards.\n\nចូលឆ្នាំថ្មីសួស្តី — Happy Khmer New Year from the team!",
    date: "Apr 25, 2026",
    relativeTime: "2h ago",
    icon: "calendar",
    pinned: true,
  },
  {
    id: "n-2026-04-22",
    category: "news",
    title: "We've added Bakong KHQR repayments",
    excerpt:
      "Pay your installments instantly with any KHQR-enabled banking app. Settlement in seconds.",
    body: "We're excited to announce that Bakong KHQR is now live as a repayment method. From the Active Loan tab, tap Pay Now and choose Bakong KHQR — scan with any participating bank app and the payment settles within 30 seconds.\n\nNo fees, instant reconciliation, and your receipt is auto-saved to Payment History.",
    date: "Apr 22, 2026",
    relativeTime: "3 days ago",
    icon: "qr-code",
  },
  {
    id: "n-2026-04-15",
    category: "alert",
    title: "Watch out for SMS phishing scams",
    excerpt:
      "We will never ask for your PIN or OTP by SMS or phone call. Stay safe.",
    body: "We've seen reports of fraudulent SMS messages claiming to be from Weloan365 and asking customers to share their PIN, OTP, or click suspicious links.\n\nWeloan365 will never:\n• Ask you to share your PIN or OTP by SMS or phone\n• Send you links to enter your password\n• Threaten to lock your account if you don't reply immediately\n\nIf you receive such a message, do not respond. Report it via the app's Feedback screen and delete it.",
    date: "Apr 15, 2026",
    relativeTime: "Apr 15",
    icon: "shield-alert",
  },
  {
    id: "n-2026-04-10",
    category: "system",
    title: "Scheduled maintenance · Apr 28, 02:00–04:00",
    excerpt:
      "The app will be briefly unavailable for an upgrade. Repayments and loan applications will resume right after.",
    body: "Weloan365 is scheduled for maintenance on Tuesday April 28, 2026 from 02:00 to 04:00 (Cambodia time). During this window:\n\n• The mobile app and web admin may be unavailable\n• In-flight payments will not be lost — they will be reconciled when service resumes\n• Login may take a few extra seconds the first time after the upgrade\n\nThank you for your patience. We're improving performance and adding new features.",
    date: "Apr 10, 2026",
    relativeTime: "Apr 10",
    icon: "settings",
  },
];

export const getNewsById = (id: string) =>
  newsItems.find((n) => n.id === id);
