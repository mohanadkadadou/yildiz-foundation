'use client'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
export function WhatsAppButton() {
  return (
    <motion.a href="https://wa.me/905395755269" target="_blank" rel="noopener noreferrer"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: 'spring' }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-2xl shadow-2xl transition-colors">
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline text-sm">WhatsApp Us</span>
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
    </motion.a>
  )
}
