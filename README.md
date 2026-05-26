# 🎓 Yildiz Foundation - Turkish University Consultancy Platform

A full-stack educational consultancy website for helping international students apply to Turkish universities.

## ✨ Features

- 🏛️ **University Database** — 20+ Turkish universities with full details
- 📚 **Programs System** — 50+ programs across Bachelor, Master, PhD, Diploma
- 🔍 **Advanced Filtering** — Filter by city, major, degree, language, budget
- 🤖 **AI Assistant** — OpenAI-powered chatbot for university recommendations
- 📅 **Consultation Booking** — Multi-step booking system with Zoom/Meet/WhatsApp
- 🌍 **Multilingual** — English, Arabic (RTL), Turkish
- 🌙 **Dark/Light Mode** — System-aware theme switching
- 📱 **Fully Responsive** — Mobile-first design
- 🔐 **Authentication** — Google OAuth + Email login
- 📊 **Admin Dashboard** — Full CRM and content management
- 📝 **Blog/SEO** — Dynamic blog with full SEO optimization
- 💬 **WhatsApp Integration** — Floating button + chat

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Radix UI / Shadcn |
| Animations | Framer Motion |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js |
| AI | OpenAI GPT-4o-mini |
| i18n | next-intl |

## 🛠️ Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/yildiz-foundation.git
cd yildiz-foundation
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in these required variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-min-32-chars"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENAI_API_KEY="sk-..."
```

### 3. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your connection string to `DATABASE_URL`
3. Run migrations:

```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yildiz-foundation.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → Import Repository
3. Add all environment variables from `.env.example`
4. Deploy! ✅

### Deploy to Render (Backend/Database)

1. Go to [render.com](https://render.com)
2. Create a **PostgreSQL** database
3. Copy the connection string to your Vercel env vars
4. Or create a **Web Service** for the full app

### Deploy with Docker

```bash
docker build -t yildiz-foundation .
docker run -p 3000:3000 --env-file .env.local yildiz-foundation
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── universities/       # University listing & detail
│   ├── programs/           # Programs listing
│   ├── consultation/       # Booking page
│   ├── blog/               # Blog listing & posts
│   ├── admin/              # Admin dashboard
│   ├── auth/               # Authentication pages
│   └── api/                # API routes
│       ├── ai-chat/        # OpenAI integration
│       ├── universities/   # Universities CRUD
│       ├── bookings/       # Booking management
│       └── leads/          # Lead management
├── components/
│   ├── home/               # Homepage sections
│   ├── layout/             # Navbar, Footer
│   └── shared/             # Shared components
├── lib/
│   ├── prisma.ts           # Database client
│   └── auth.ts             # NextAuth config
├── i18n/
│   └── messages/           # en.json, ar.json, tr.json
└── styles/
    └── globals.css         # Global styles + design tokens

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Demo data seeder
```

---

## 🎨 Design System

- **Primary**: Deep Navy Blue (#0f2057 → #1e3a8a)
- **Accent**: Gold (#fbbf24 → #d97706)
- **Glassmorphism** cards with backdrop-blur
- **Framer Motion** animations throughout
- **Premium typography** with Inter font

---

## 📊 Database Schema

- **User** — Students and admin accounts
- **University** — 20+ Turkish universities with full metadata
- **Program** — Degree programs with fees, duration, careers
- **Booking** — Consultation bookings with status tracking
- **Lead** — CRM lead management
- **BlogPost** — SEO-optimized multilingual blog
- **Testimonial** — Student success stories

---

## 🔑 Admin Access

Visit `/admin` — Protected by NextAuth (ADMIN role required)

Set user role to ADMIN in database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## 📞 Support

- WhatsApp: +90 500 000 0000
- Email: info@yildizfoundation.com

Built with ❤️ by Yildiz Foundation Team
