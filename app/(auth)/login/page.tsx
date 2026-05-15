import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
        <CardDescription className="text-gray-400">Sign in to your NexVPN account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" className="bg-gray-800 border-gray-700 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Password</Label>
          <Input id="password" type="password" className="bg-gray-800 border-gray-700 text-white" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In</Button>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </CardContent>
    </Card>
  )
}
