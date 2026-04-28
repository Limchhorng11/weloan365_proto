# Weloan365 — Mobile Prototype (Next.js)

Interactive prototype of the Weloan365 mobile app, built with Next.js 14
(App Router), TypeScript, Tailwind CSS, Zustand and Framer Motion.

All data is mocked — no backend or API is required to run the app.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

On desktop widths you'll see a **phone frame** in the center and a **dev
side panel** on the left with shortcuts to every screen. On narrow widths
(< 860px) the side panel is hidden and the phone fills the viewport.

### Demo credentials

- **Sign-in PIN:** `123456`
- **Sign-up OTP:** `123456`

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |
| `npm run type-check` | Run `tsc --noEmit` |

## Project structure

```
mobile/
├── app/
│   ├── layout.tsx                          # HTML shell only (fonts, body)
│   │
│   └── (prototype)/                        # ← phone frame + side panel
│       ├── layout.tsx
│       ├── page.tsx                        # / Splash → /onboarding
│       ├── (auth)/                         # No tab bar
│       │   ├── layout.tsx
│       │   ├── onboarding/
│       │   ├── welcome/                    # Language toggle
│       │   ├── sign-in/
│       │   ├── sign-up/{phone,otp,create-pin,confirm-pin,biometric,reference}/
│       │   └── forgot-pin/{phone,otp,identity,new-pin,success}/
│       └── (app)/                          # With tab bar
│           ├── layout.tsx
│           ├── home/
│           ├── my-loan/                    # ?tab= for segments + nested details
│           ├── chat/                       # list + [id]
│           ├── loan/                       # products[/id[/request]] + calculator + consultation
│           ├── promo/[id]/                 # Tappable promo detail
│           ├── refer/                      # Refer & Earn
│           └── more/                       # profile, security, notifications, …
│
├── components/
│   ├── phone/                          # PhoneFrame, StatusBar, TabBar, SidePanel
│   ├── ui/                             # NavHeader, Button, Input, Card, ListRow…
│   ├── sheets/                         # SheetHost + Payment/Confirm/Success/Biometric
│   ├── feedback/                       # ToastHost
│   └── domain/
│       ├── auth/                       # PinPad, OtpBoxes
│       ├── home/                       # QuickActions, PromoCarousel
│       ├── loan/                       # ProductCard, LoanSummary, Timeline, RepaymentRow, DynamicIcon
│       └── chat/                       # ChatRow, MessageBubble
│
├── lib/
│   ├── types/                          # Domain types (User, Loan, Chat…)
│   ├── mock/                           # Mock data, grouped by domain
│   ├── utils/                          # cn, format, emi, schedule
│   └── hooks/                          # useToast, useSheet
│
├── stores/                             # Zustand stores
│   ├── auth.ts
│   ├── theme.ts
│   ├── toast.ts
│   ├── sheet.ts
│   └── chat.ts
│
├── styles/globals.css                  # Design tokens + component primitives
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Design principles

- **Route per screen** — every distinct screen gets its own URL so it
  can be linked, bookmarked, and mapped 1:1 to a native screen later.
- **Grouped layouts** — `(prototype)` has phone frame + side panel,
  and within it `(auth)` has no tab bar while `(app)` has it. Route
  group folders (parens) don't
  appear in URLs.
- **Domain-oriented components** — `components/domain/` contains
  feature-specific pieces (auth PinPad, loan cards, chat bubbles) so
  the UI primitives stay reusable across features.
- **Typed mock data** — everything in `lib/mock/` is fully typed via
  `lib/types/`. Replace these exports with real API calls when the
  backend lands; the component layer shouldn't need to change.
- **Global state, one source of truth** — sheets, toasts, theme, auth,
  and chat messages all live in Zustand stores so screens stay dumb.

## Replacing mocks with a real API (future)

1. Add `lib/api/` with a typed HTTP client.
2. Wrap pages that need data in React Query / SWR (or async Server
   Components for read-only lists).
3. Keep `lib/mock/` available behind a flag for Storybook / offline dev.
4. Types in `lib/types/` stay as the shared contract.

## Next steps (not included)

- Dependency install & `next dev` — run yourself when ready.
- Git init.
- Real backend integration.
- Khmer localization (hooks/layout already ready; just add `next-intl`).
- E2E tests (Playwright) for each flow.
- Convert to native (Swift / Kotlin) — each route is a 1:1 screen.

## Legacy

The original HTML/CSS/JS prototype lives in `_legacy-prototype/` for
reference. It is excluded from the build and from git.
