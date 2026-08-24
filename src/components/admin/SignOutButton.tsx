'use client'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className="flex items-center gap-2 text-blue-300 hover:text-white text-sm transition-colors w-full"
    >
      <LogOut className="w-4 h-4" /> Sign Out
    </button>
  )
}
