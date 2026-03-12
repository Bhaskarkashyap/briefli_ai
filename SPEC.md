# Briefliii AI - AI Summarization SaaS

## Project Overview
- **Project Name:** Briefliii AI
- **Type:** SaaS Web Application
- **Core Functionality:** AI-powered text summarization tool with free tier limits and paid upgrades
- **Target Users:** Content creators, writers, marketers, students, professionals

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js with credentials provider
- **Database:** PostgreSQL with Prisma ORM
- **Payments:** Stripe
- **AI Integration:** OpenAI API

---

## UI/UX Specification

### Color Palette
```css
--bg-primary: #0a0a0f
--bg-secondary: #12121a
--bg-tertiary: #1a1a25
--accent-primary: #6366f1 (Indigo)
--accent-secondary: #8b5cf6 (Purple)
--accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
--text-primary: #f8fafc
--text-secondary: #94a3b8
--text-muted: #64748b
--border: #2e2e3a
--success: #22c55e
--warning: #f59e0b
--error: #ef4444
```

### Typography
- **Font Family:** "Outfit" (headings), "Inter" (body)
- **Headings:** 
  - H1: 48px, font-weight 700
  - H2: 36px, font-weight 600
  - H3: 24px, font-weight 600
- **Body:** 16px, font-weight 400
- **Small:** 14px, font-weight 400

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Page Structure

### 1. Landing Page (`/`)
- **Header:** Logo, Navigation, Sign In/Get Started buttons
- **Hero Section:** 
  - Headline: "Summarize Anything in Seconds"
  - Subheadline: "AI-powered tool that transforms long content into concise, actionable summaries"
  - CTA Buttons: "Start for Free" / "View Pricing"
- **Features Section:** 4 feature cards with icons
- **Pricing Section:** Free + Pro tiers side by side
- **Footer:** Links, copyright

### 2. Pricing Page (`/pricing`)
- Detailed pricing cards
- Feature comparison table
- FAQ section

### 3. Dashboard (`/dashboard`)
- Sidebar navigation
- Usage stats (daily limit, used, remaining)
- Quick action buttons
- Recent activity list

### 4. Summarization Tool (`/dashboard/tools`)
- Text input area (with character counter)
- Summary mode selector (Bullet/Paragraph)
- Generate button
- Output area with copy/export options

### 5. Settings (`/dashboard/settings`)
- Profile information
- Subscription status
- Billing history (mock)

---

## Functionality Specification

### Authentication
- Email/password registration and login
- Session management with JWT
- Protected routes

### Usage Limits (Enforced on Backend)
| Feature | Free Tier | Pro Tier |
|---------|-----------|----------|
| Daily Summaries | 3 | Unlimited |
| Input Words | 500 | 10,000 |
| Summary Modes | Basic | All |
| Export | No | Yes |
| API Access | No | Yes |

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/usage` - Get usage stats
- `POST /api/summarize` - Generate summary (with limit check)
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

---

## Component List
1. `Button` - Primary, secondary, outline variants
2. `Input` - Text input with label and error states
3. `Card` - Reusable card component
4. `PricingCard` - Pricing tier display
5. `Navbar` - Site navigation
6. `Sidebar` - Dashboard sidebar
7. `UsageMeter` - Visual usage progress bar
8. `TextEditor` - Input for content to summarize
9. `SummaryOutput` - Display AI generated summary
10. `Modal` - Reusable modal component

---

## Acceptance Criteria
1. Landing page loads with all sections visible
2. User can register and login
3. Free users are limited to 3 summaries per day
4. Pro users can generate unlimited summaries
5. Usage meter updates in real-time
6. Stripe checkout redirects properly
7. Dashboard shows correct usage statistics
8. All pages are responsive on mobile/tablet/desktop
