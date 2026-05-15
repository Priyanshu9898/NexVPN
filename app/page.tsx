import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-6 inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
          AI-Powered Routing
        </div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          NexVPN
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          AI-Powered Privacy. Smarter Routing.
        </p>
        <p className="text-gray-500 mb-10">
          Our AI picks the fastest, most secure exit node for you — automatically. No guessing, no manual switching.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
