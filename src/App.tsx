import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Community } from './pages/Community';
import { MyScrapbook } from './pages/MyScrapbook';
import { Profile } from './pages/Profile';
import { JourneyDetail } from './pages/JourneyDetail';
import { MapView } from './pages/MapView';
import { Auth } from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/community" element={<Community />} />
          <Route path="/my-scrapbook" element={<MyScrapbook />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/journey/:id" element={<JourneyDetail />} />
          <Route path="/map" element={<MapView />} />
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Home />} />
        </Routes>
        
        {/* Footer */}
        <footer className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>Made with ❤️ by travelers, for travelers</p>
            <p className="text-sm text-white/80 mt-2">Share your journey, inspire the world</p>
          </div>
        </footer>
      </div>
    </Router>
    <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}