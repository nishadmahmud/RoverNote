import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, BookOpen, User, Plane, Map, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    toast.success('See you soon! 👋');
    navigate('/');
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform group">
            <div className="relative">
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-2 rounded-lg shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform">
                <Plane className="text-white" size={20} />
              </div>
              {/* Decorative stamp effect */}
              <div className="absolute inset-0 border-2 border-[var(--color-primary)] rounded-lg transform rotate-3 opacity-30"></div>
            </div>
            <div>
              <span className="text-[var(--color-primary)] tracking-tight" style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '1.5rem' }}>RoverNote</span>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                    isActive
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
                  <span className="hidden sm:inline relative z-10 text-sm">{item.label}</span>
                  
                  {/* Hover effect - sticker style */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-[var(--color-secondary)]/0 group-hover:bg-[var(--color-secondary)]/10 rounded-lg transition-colors"></div>
                  )}
                </Link>
              );
            })}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                {/* User avatar/name */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[var(--color-secondary)]/10 rounded-full">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs">
                    {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Kalam, cursive' }}>
                    {profile?.display_name || 'Traveler'}
                  </span>
                </div>
                {/* Logout button */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 ml-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <LogIn size={18} />
                <span className="text-sm">Sign In</span>
              </Link>
            )}
          </nav>
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
