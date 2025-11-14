import Link from 'next/link'
import { Compass } from 'lucide-react'
import Button from './components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
          <Compass className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Lost on your journey?
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you&apos;ve wandered off the map. Let&apos;s get you back on track!
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

