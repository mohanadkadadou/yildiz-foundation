import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, Users, Calendar, FileText, BarChart3, MessageSquare, Settings, BookOpen, Home } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/universities', label: 'Universities', icon: GraduationCap },
  { href: '/admin/programs', label: 'Programs', icon: BookOpen },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex">
      <aside className="w-64 bg-navy-900 flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-navy-800">
          <div className="bg-white rounded-xl p-2 inline-block"><Image src="/images/logo.png" alt="Yildiz Foundation" width={120} height={38} className="h-8 w-auto" /></div>
          <div className="text-blue-200 text-xs mt-2">Admin Dashboard</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors text-sm">
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-navy-800">
          <Link href="/" className="flex items-center gap-2 text-blue-300 hover:text-white text-sm transition-colors">← Back to Site</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
