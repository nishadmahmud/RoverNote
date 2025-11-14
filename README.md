# 🗺️ RoverNote

A cozy, minimal travel journaling web app built with Next.js and Supabase. Document your adventures, capture memories, and relive your journeys in a beautiful, intentionally simple interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Features

- 🔐 **Secure Authentication** - Email signup/login with Supabase Auth
- 📝 **Journey Management** - Create, edit, and delete travel entries
- 📸 **Image Upload** - Store beautiful photos in Supabase Storage
- 🏷️ **Tags & Search** - Organize and find your journeys easily
- 🎨 **Cozy Design** - Warm colors, rounded corners, and gentle animations
- 📱 **Responsive** - Works beautifully on mobile, tablet, and desktop
- 🔒 **Privacy First** - Your data is yours, RLS ensures complete privacy
- ⚡ **Fast** - Server-side rendering for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works!)

### Installation

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd rovernote
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL in `database-schema.sql` in your SQL Editor
   - Create a storage bucket named `journey-images` (make it public)

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** 🎉

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📂 Project Structure

```
rovernote/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (app)/               # Protected app pages
│   │   ├── journeys/        # Journey CRUD
│   │   ├── profile/         # User profile
│   │   └── map/             # Map view (placeholder)
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   ├── Navbar.js
│   │   ├── JourneyCard.js
│   │   └── ImageUpload.js
│   └── lib/                # Utilities & Supabase clients
├── middleware.js           # Route protection
├── database-schema.sql     # Database setup
└── SETUP.md               # Detailed setup guide
```

## 🎨 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel (recommended)
- **Icons**: Lucide React
- **Utilities**: date-fns, clsx

## 🎯 Core Features

### Authentication
- Email/password signup and login
- Protected routes with middleware
- Secure session management

### Journey Management
- Create journeys with title, location, dates, body, tags, and images
- Edit existing journeys
- Delete journeys (including images)
- Search and filter journeys

### Image Handling
- Drag & drop image upload
- Automatic image validation (type, size)
- Storage in Supabase with user-specific folders
- Automatic cleanup on deletion

### User Experience
- Beautiful, cozy interface
- Responsive design
- Loading states and error handling
- Empty states with friendly messages
- Smooth transitions and hover effects

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Images stored with user ID in path
- Server-side authentication checks
- Secure API routes

## 📖 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup and configuration guide
- [DEV_PLAN.md](./DEV_PLAN.md) - Development plan and architecture
- [database-schema.sql](./database-schema.sql) - Complete database schema

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

For detailed deployment instructions, see [SETUP.md](./SETUP.md#-deployment-vercel)

## 🧪 Testing

Run through the testing checklist in [SETUP.md](./SETUP.md#-testing-checklist) before deploying to production.

## 🎨 Customization

### Color Palette
Edit `app/globals.css` to customize colors:
- **Coral**: Primary action color (#FF8A80)
- **Teal**: Secondary color (#4DB6AC)
- **Cream**: Background color (#FFFBF5)
- **Sage**: Accent color (#A5B4A3)

### Branding
- Update app name in `app/components/Navbar.js`
- Change metadata in `app/layout.js`
- Customize landing page in `app/page.js`

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Future Enhancements

- Interactive map view with journey pins
- Google OAuth login
- Dark mode
- Journey export (PDF/JSON)
- Social sharing
- Collections/albums
- PWA support

---

Made with ❤️ for travelers • Built with Next.js & Supabase

**Happy Journaling! 🗺️✨**
