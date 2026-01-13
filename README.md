# F&J Stone Services

A modern, full-stack website for F&J Stone Services — a professional masonry and stonework company serving the Greater Chicago Area. Built with Next.js 16, Supabase, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

## 🏗️ Overview

This project is a complete business website with:
- **Public-facing pages** showcasing services, portfolio, and contact information
- **Admin dashboard** for content management, quote requests, and project portfolio
- **Real-time quote request system** with file uploads and email notifications
- **SEO optimized** with dynamic metadata, sitemap, and Open Graph images

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** — React framework with App Router & Turbopack
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** — Animation library
- **[Lucide React](https://lucide.dev/)** — Icon library

### Backend & Database
- **[Supabase](https://supabase.com/)** — PostgreSQL database, authentication, and storage
- **[Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)** — Server-side form handling
- **[Zod](https://zod.dev/)** — Schema validation

### Monitoring & Analytics
- **[Vercel Analytics](https://vercel.com/analytics)** — Web analytics
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** — Performance monitoring
- **[Sentry](https://sentry.io/)** — Error tracking and performance monitoring

### Email
- **[Resend](https://resend.com/)** — Transactional email service

## 📁 Project Structure

```
fjs-stone/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   ├── loading.tsx          # Loading skeleton
│   ├── globals.css          # Global styles
│   ├── robots.ts            # robots.txt generation
│   ├── sitemap.ts           # Dynamic sitemap
│   ├── actions/             # Server actions
│   │   ├── admin.ts         # Admin operations
│   │   └── quote.ts         # Quote submission
│   ├── admin/               # Admin dashboard
│   │   ├── layout.tsx       # Admin layout with auth
│   │   ├── projects/        # Project management
│   │   ├── quotes/          # Quote request management
│   │   ├── reviews/         # Review management
│   │   └── settings/        # Site settings
│   ├── api/                 # API routes
│   │   └── admin/           # Protected admin APIs
│   ├── contact/             # Contact/quote page
│   ├── portfolio/           # Portfolio pages
│   ├── privacy/             # Privacy policy
│   ├── services/            # Services page
│   └── terms/               # Terms of service
├── components/              # Reusable components
│   ├── admin/               # Admin-specific components
│   │   ├── EditModeContext.tsx
│   │   ├── EditableBlock.tsx
│   │   ├── EditorDrawer.tsx
│   │   └── ImageManager.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── ProjectCard.tsx
│   ├── ReviewCard.tsx
│   └── Skeleton.tsx
├── lib/                     # Utilities and configurations
│   ├── supabase/            # Supabase clients and queries
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   ├── queries.ts       # Public queries
│   │   ├── admin-queries.ts # Admin queries
│   │   └── storage.ts       # Storage utilities
│   ├── email.ts             # Email templates
│   ├── rate-limit.ts        # Rate limiting
│   ├── types.ts             # TypeScript types
│   └── validations.ts       # Zod schemas
├── public/                  # Static assets
│   ├── images/              # Local images
│   ├── og-image.jpg         # Open Graph image
│   └── icon.svg             # Favicon
├── supabase/                # Database
│   ├── setup.sql            # Initial schema
│   └── migrations/          # SQL migrations
└── tests/                   # Test files
```

## 🗄️ Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `projects` | Portfolio projects with title, slug, description, location, service type |
| `project_images` | Images linked to projects, stored in Supabase Storage |
| `reviews` | Customer reviews with ratings |
| `quote_requests` | Contact form submissions |
| `quote_request_files` | Files attached to quote requests |
| `content_blocks` | Editable content sections (hero text, service descriptions) |
| `site_settings` | Global settings (phone, email, service area) |
| `admins` | Admin user whitelist |

### Row Level Security (RLS)

All tables have RLS policies:
- **Public read** for published content (`is_published = true`)
- **Admin-only write** via `is_admin()` database function
- **Service role bypass** for server-side operations

## 🔐 Security Features

### Authentication & Authorization
- Supabase Auth with email/password
- Admin whitelist table (`admins`)
- Middleware protection for `/admin/*` routes
- API route protection with admin verification

### Input Validation
- Zod schemas for all form inputs
- Server-side validation on all mutations
- Header injection prevention
- File type and size validation

### Rate Limiting
- 5 requests per minute per IP on quote submissions
- Honeypot field for bot detection

### File Upload Security
- 5MB max file size
- 5 files max per submission
- Allowed types: JPEG, PNG, WebP only
- Secure filename generation
- Server action body limit: 25MB

## ✨ Key Features

### Public Features
- **Responsive design** — Mobile-first, works on all devices
- **Portfolio gallery** — Filterable by service type with lightbox
- **Quote request form** — With file uploads and validation
- **SEO optimized** — Dynamic metadata, sitemap, Open Graph

### Admin Dashboard
- **Project management** — Create, edit, delete projects with drag-and-drop image reordering
- **Quote management** — View submissions, update status, add notes
- **Review management** — Add/edit customer reviews
- **Site settings** — Update contact info
- **Inline editing** — Toggle edit mode to edit content directly on pages

### Content Management
- **Editable blocks** — Hero text, service descriptions, about content
- **Real-time updates** — Changes reflect immediately
- **Draft/publish workflow** — Control what's visible to the public

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- Resend account (for emails)

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Resend)
RESEND_API_KEY=re_your_api_key
EMAIL_TO=your-email@example.com
EMAIL_FROM=quotes@yourdomain.com

# Sentry (optional)
SENTRY_AUTH_TOKEN=your-sentry-token

# Site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Installation

```bash
# Clone the repository
git clone https://github.com/adriangarciao/FJ-Stone.git
cd FJ-Stone/fjs-stone

# Install dependencies
npm install

# Run database migrations
# (Execute SQL files in supabase/setup.sql and supabase/migrations/ in Supabase SQL editor)

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:integration` | Run integration tests |

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Add all `.env.local` variables to your Vercel project settings.

**Important:** Ensure `NEXT_PUBLIC_SITE_URL` matches your production domain for sitemap and OG images.

## 📊 Monitoring

### Sentry
- Error tracking in production
- Performance monitoring
- Source maps for debugging

### Vercel Analytics
- Page views and visitors
- Web Vitals (LCP, FID, CLS)
- Geographic distribution

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# Watch mode
npm run test -- --watch
```

## 📝 API Reference

### Server Actions

| Action | Description |
|--------|-------------|
| `submitQuoteRequest(formData)` | Submit a quote request with files |
| `updateQuoteStatus(id, status, notes?)` | Update quote status (admin) |
| `updateContentBlock(key, content)` | Update editable content (admin) |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/projects/create` | POST | Create new project |
| `/api/admin/projects/[id]` | PUT/DELETE | Update/delete project |
| `/api/admin/projects/[id]/upload-images` | POST | Upload project images |
| `/api/admin/projects/[id]/reorder-images` | POST | Reorder project images |
| `/api/admin/project-images/[imageId]` | DELETE | Delete single image |
| `/api/admin/content/update` | POST | Update content block |

## 🎨 Design System

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#990303` | Accent color, CTAs, hover states |
| Dark Gray | `#292323` | Headers, backgrounds, primary text |
| Medium Gray | `#71706e` | Secondary elements, gradients |

### Typography
- **Headings:** Bold weight, responsive sizing (text-4xl to text-6xl)
- **Body:** Regular weight, clean and readable (text-base to text-lg)

## 🔄 Recent Updates

### v1.0.0 (January 2026)
- ✅ Initial release with full admin dashboard
- ✅ Portfolio management with image uploads
- ✅ Quote request system with email notifications
- ✅ Editable content blocks
- ✅ SEO optimization (metadata, sitemap, robots.txt)
- ✅ Vercel Analytics and Sentry integration
- ✅ Privacy Policy and Terms of Service pages
- ✅ Loading skeletons and performance optimizations
- ✅ Mobile-responsive design

## 📄 License

Private project for F&J Stone Services.

---

Built with ❤️ by Adrian Garcia
