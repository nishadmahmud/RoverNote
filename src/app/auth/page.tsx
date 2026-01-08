'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Plane, Eye, EyeOff, MapPin, Camera, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function AuthPage() {
  const router = useRouter();
  const { user, signIn, signUp, signInWithGoogle, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/my-scrapbook');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back! 🌍');
        router.push('/my-scrapbook');
        router.refresh();
      }
    } else {
      const { error } = await signUp(formData.email, formData.password, formData.name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! ✈️');
        router.push('/my-scrapbook');
        router.refresh();
      }
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] via-pink-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-[var(--color-primary)] opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>
          <Plane size={60} />
        </div>
        <div className="absolute bottom-32 right-20 text-[var(--color-secondary)] opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <Plane size={80} className="rotate-45" />
        </div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Auth Container */}
      <div className="w-full max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[var(--color-accent)]">
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full -ml-30 -mb-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm transform -rotate-6">
                  <Plane className="text-white" size={32} />
                </div>
                <h2 className="text-white text-4xl" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                  RoverNote
                </h2>
              </div>

              <h3 className="text-white text-3xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                {isLogin ? 'Welcome Back!' : 'Join the Adventure!'}
              </h3>
              <p className="text-white/90 text-lg mb-8" style={{ fontFamily: 'Kalam, cursive' }}>
                {isLogin 
                  ? 'Continue your journey and share your amazing travel stories with the world! 🌍'
                  : 'Start documenting your travels and connect with fellow explorers around the globe! ✈️'
                }
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Camera size={20} />
                  </div>
                  <span style={{ fontFamily: 'Kalam, cursive' }}>Create beautiful travel scrapbooks</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <MapPin size={20} />
                  </div>
                  <span style={{ fontFamily: 'Kalam, cursive' }}>Track your adventures on a world map</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Heart size={20} />
                  </div>
                  <span style={{ fontFamily: 'Kalam, cursive' }}>Connect with travel enthusiasts</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20">
                <p className="text-white/90 italic text-sm" style={{ fontFamily: 'Caveat, cursive', fontSize: '1.1rem' }}>
                  &quot;The world is a book, and those who do not travel read only one page.&quot;
                </p>
                <p className="text-white/70 text-right text-xs mt-2">— Saint Augustine</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-12 bg-[var(--color-paper)]">
            <div className="flex gap-2 mb-8 bg-gray-100 p-2 rounded-full">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-full transition-all ${
                  isLogin
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ fontFamily: 'Permanent Marker, cursive' }}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-full transition-all ${
                  !isLogin
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ fontFamily: 'Permanent Marker, cursive' }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Kalam, cursive' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Wanderlust"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-secondary)] focus:outline-none transition-colors bg-white"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Kalam, cursive' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-secondary)] focus:outline-none transition-colors bg-white"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Kalam, cursive' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-secondary)] focus:outline-none transition-colors bg-white"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Kalam, cursive' }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-secondary)] focus:outline-none transition-colors bg-white"
                      required={!isLogin}
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.1rem' }}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Plane size={24} />
                    {isLogin ? 'Sign In & Explore' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[var(--color-paper)] text-gray-500" style={{ fontFamily: 'Kalam, cursive' }}>
                    or continue with
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const { error } = await signInWithGoogle();
                if (error) {
                  toast.error(error.message);
                }
              }}
              className="mt-6 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span style={{ fontFamily: 'Kalam, cursive', fontSize: '1rem' }}>
                Continue with Google
              </span>
            </button>

            <div className="mt-6 text-center">
              <Link 
                href="/"
                className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] text-sm"
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full flex items-center justify-center shadow-lg transform rotate-12 border-4 border-white">
          <span className="text-3xl">✈️</span>
        </div>
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center shadow-lg transform -rotate-12 border-4 border-white">
          <span className="text-4xl">🌍</span>
        </div>
      </div>
    </div>
  );
}
