import Link from 'next/link'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '⬛' },
  { href: '/servers', label: 'Servers', icon: '🌐' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">NexVPN</h1>
        <p className="text-xs text-blue-400 mt-1">AI-Powered Privacy</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <span>{link.icon}</span>
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
