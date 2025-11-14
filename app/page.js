import Link from 'next/link'
import { Mountain, Compass, BookOpen, Camera, Sparkles } from 'lucide-react'
import Button from './components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-coral-400 to-teal-400 rounded-2xl mb-8 shadow-lg">
              <Mountain className="w-10 h-10 text-white" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Your World, Your Stories
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A cozy space to document your travels, capture memories, and relive your adventures.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  <Sparkles className="w-5 h-5" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Tagline */}
            <p className="mt-6 text-gray-500 text-sm">
              Free to use • Beautiful & Simple • Your memories, your way
            </p>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-coral-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              Everything you need to document your adventures
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple, beautiful, and thoughtfully designed for travelers who love to remember.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-cream-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-coral-100 rounded-xl mb-6">
                <Camera className="w-8 h-8 text-coral-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Capture Memories
              </h3>
              <p className="text-gray-600">
                Upload photos, write stories, and tag your experiences. Your journeys, beautifully preserved.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-cream-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-xl mb-6">
                <Compass className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Track Adventures
              </h3>
              <p className="text-gray-600">
                Keep track of where you&apos;ve been, when you went, and what made each place special.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-cream-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-300 rounded-xl mb-6">
                <BookOpen className="w-8 h-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Relive Moments
              </h3>
              <p className="text-gray-600">
                Browse your collection, search by location or tags, and revisit your favorite memories anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral-400 to-teal-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start documenting?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join RoverNote today and create your personal travel journal. It&apos;s free, easy, and made with love for travelers.
          </p>
          <Link href="/signup">
            <Button 
              variant="primary" 
              size="lg" 
              className="bg-white text-coral-500 hover:bg-gray-50 min-w-[200px]"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-800">RoverNote</span>
            </div>
            <p className="text-gray-600 text-sm">
              Made with ❤️ for travelers • © 2024 RoverNote
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
