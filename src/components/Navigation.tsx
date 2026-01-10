'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Users, BookOpen, User, Map, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home, requiresAuth: false },
  { href: '/community', label: 'Community', icon: Users, requiresAuth: false },
  { href: '/map', label: 'Map', icon: Map, requiresAuth: false },
  { href: '/my-scrapbook', label: 'My Scrapbook', icon: BookOpen, requiresAuth: false },
  { href: '/profile', label: 'Profile', icon: User, requiresAuth: true },
];

// Bottom nav links for logged-in mobile users
const bottomNavLinks = [
  { href: '/community', label: 'Community', icon: Users },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/my-scrapbook', label: 'Scrapbook', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('See you soon! 👋');
    window.location.href = '/';
  };

  // Filter nav items based on auth state
  const visibleNavItems = navLinks.filter(item => !item.requiresAuth || user);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-28">
            <Image
              src="/logo.png"
              alt="RoverNote"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {visibleNavItems.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                {profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                  <img 
                    src={profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                    alt="Avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-medium">
                    {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground">
                  {profile?.display_name || user.email?.split('@')[0] || 'User'}
                </span>
              </div>
              {/* Logout button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href="/auth">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                <Link href="/auth">
                  Start Free
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button - Only show when NOT logged in */}
        {!user && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        )}

        {/* Mobile Logout Button - Only show when logged in */}
        {user && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="md:hidden gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </Button>
        )}
      </nav>

      {/* Mobile Navigation Overlay - Only for non-logged in users */}
      {isOpen && !user && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="md:hidden fixed top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="container mx-auto px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {visibleNavItems.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 space-y-2 border-t border-border/50">
                <Button asChild variant="outline" className="w-full justify-center gap-2">
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    Start Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

    </header>

    {/* Mobile Bottom Navigation - Only for logged in users */}
    {user && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50 safe-area-pb">
        <nav className="flex items-center justify-around h-16 px-2">
          {bottomNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const isProfile = link.href === '/profile';
            const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-xl transition-all duration-200',
                  isActive && 'bg-primary/10'
                )}>
                  {isProfile && avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile"
                      className={cn(
                        'h-5 w-5 rounded-full object-cover transition-transform',
                        isActive && 'scale-110 ring-2 ring-primary'
                      )}
                    />
                  ) : (
                    <Icon className={cn(
                      'h-5 w-5 transition-transform',
                      isActive && 'scale-110'
                    )} />
                  )}
                </div>
                <span className={cn(
                  'text-[10px] font-medium',
                  isActive && 'font-semibold'
                )}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    )}
  </>
  );
}

export default Navigation;
