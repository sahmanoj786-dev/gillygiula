# ListingsHub — Next.js 14 Classified Listing Website

A full-featured classified listings site with admin CMS, built with Next.js 14, Tailwind CSS, Prisma + SQLite.

## Features
- **Public Site**: Home, State pages, City pages, Profile pages, Gallery, Contact
- **Admin CMS**: Dashboard, Profile CRUD + image upload, City/State management, Gallery manager
- **SEO**: Dynamic metadata, Open Graph, Sitemap, Robots.txt, breadcrumbs, SEO content blocks
- **Auth**: JWT cookie-based admin authentication
- **Dark Mode**: Full dark/light toggle

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Prisma ORM + SQLite
- bcryptjs + jose (auth)
- next-themes (dark mode)
- react-hot-toast (notifications)
- lucide-react (icons)
- sharp (image processing)

## URL Structure
| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/state/[slug]` | State listing page |
| `/city/[slug]` | City listing page |
| `/profile/[slug]` | Profile detail page |
| `/gallery` | Masonry image gallery |
| `/contact` | Contact form |
| `/admin` | Admin redirect |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Stats dashboard |
| `/admin/profiles` | Manage profiles |
| `/admin/profiles/new` | Add profile |
| `/admin/profiles/[id]` | Edit profile |
| `/admin/cities` | Manage cities |
| `/admin/states` | Manage states |
| `/admin/gallery` | Gallery manager |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Robots file |

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env — change JWT_SECRET for production!
```

### 3. Set up database
```bash
npm run db:push      # Create SQLite database from schema
npm run db:seed      # Seed sample data + admin user
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Admin panel
Go to [http://localhost:3000/admin](http://localhost:3000/admin)

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ Change the password after first login in production!

## Production Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```
Set environment variables in Vercel dashboard.

### Self-hosted
```bash
npm run build
npm start
```

### Change admin password
```bash
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
bcrypt.hash('YOUR_NEW_PASSWORD', 10).then(hash => {
  prisma.admin.update({ where: { username: 'admin' }, data: { password: hash } })
    .then(() => { console.log('Password updated'); prisma.\$disconnect(); });
});
"
```

## Database Models

```
State    id, name, slug
City     id, name, slug, stateId
Profile  id, name, slug, cityId, stateId, description, images (JSON array), phone, email, age, featured, createdAt, updatedAt
Gallery  id, imageUrl, caption, createdAt
Admin    id, username, password (bcrypt hash)
```

## Image Uploads
- Images are stored in `public/uploads/`
- Max size: 5MB per file
- Allowed types: JPG, PNG, WEBP, GIF
- Profile images stored as JSON array in `profiles.images`

## Scaling Tips
- For thousands of profiles: add database indexes on `cityId`, `stateId`, `featured`
- Switch to PostgreSQL by updating `prisma/schema.prisma` provider
- Use Cloudinary/S3 instead of local uploads for production
- Enable ISR (Incremental Static Regeneration) — already set with `revalidate = 60`

## Customization
- Change site name/URL: edit `lib/utils.ts` → `SITE_NAME`, `SITE_URL`
- Change colors: edit `tailwind.config.ts` brand colors
- Add more admin fields to profiles: edit `prisma/schema.prisma` + `ProfileForm.tsx`
