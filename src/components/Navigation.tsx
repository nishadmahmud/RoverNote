'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, BookOpen, User, Plane, Map, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('See you soon! 👋');
    window.location.href = '/';
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home', requiresAuth: false },
    { path: '/community', icon: Users, label: 'Community', requiresAuth: false },
    { path: '/map', icon: Map, label: 'Map', requiresAuth: false },
    { path: '/my-scrapbook', icon: BookOpen, label: 'My Scrapbook', requiresAuth: true },
    { path: '/profile', icon: User, label: 'Profile', requiresAuth: true }
  ];

  // Filter nav items based on auth state
  const visibleNavItems = navItems.filter(item => !item.requiresAuth || user);

  return (
    <header className="bg-[var(--color-paper)] shadow-md sticky top-0 z-40 border-b-4 border-[var(--color-accent)]">
      {/* Decorative top border with scrapbook style */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform group">
              <div className="relative h-auto w-24">
                <img
                  src="/logo.png"
                  alt="RoverNote"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group ${isActive
                      ? 'text-[var(--color-primary)]'
                      : 'text-gray-600 hover:text-[var(--color-secondary)]'
                    }`}
                >
                  {/* Active indicator - washi tape style */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-[var(--color-accent)]/30 rounded-lg transform -rotate-1"></div>
                      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[var(--color-primary)]"></div>
                    </>
                  )}

                  <Icon size={18} className="relative z-10" />
                  <span className="hidden lg:inline relative z-10 text-sm">{item.label}</span>

                  {/* Hover effect - sticker style */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-[var(--color-secondary)]/0 group-hover:bg-[var(--color-secondary)]/10 rounded-lg transition-colors"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth Buttons */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                {/* User avatar/name */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[var(--color-secondary)]/10 rounded-full">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs">
                    {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm text-gray-700 font-sans font-medium">
                    {profile?.display_name || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                {/* Logout button */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 ml-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <LogIn size={18} />
                <span className="text-sm">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Decorative bottom accents - doodle style */}
      <div className="absolute bottom-0 left-10 w-8 h-8 opacity-20">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--color-accent)" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-20 w-6 h-6 opacity-20">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="var(--color-secondary)" />
        </svg>
      </div>
    </header>
  );
}
