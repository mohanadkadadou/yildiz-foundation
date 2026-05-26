'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Loader2 } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

export function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI university advisor. Tell me your study goals and budget, and I'll recommend the best Turkish universities for you! 🎓" }
  ])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, userMsg] }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please contact us via WhatsApp.' }])
    }
    setLoading(false)
  }

  return (
    <>
      <motion.button onClick={() => setOpen(true)} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: 'spring' }} whileHover={{ scale: 1.1 }}
        className="fixed bottom-20 right-6 z-50 w-14 h-14 bg-gradient-to-br from-navy-700 to-navy-900 text-white rounded-2xl shadow-2xl flex items-center justify-center">
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-pulse" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-navy-700 overflow-hidden">
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-400/20 rounded-xl flex items-center justify-center"><Bot className="w-4 h-4 text-gold-400" /></div>
                <div><div className="text-white font-semibold text-sm">AI University Advisor</div><div className="text-green-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />Online</div></div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-navy-800 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-navy-800 text-gray-800 dark:text-gray-100 rounded-tl-sm'}`}>{m.content}</div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-gray-100 dark:bg-navy-800 px-3 py-2 rounded-2xl rounded-tl-sm"><Loader2 className="w-4 h-4 animate-spin text-gray-400" /></div></div>}
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-navy-700 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about universities..."
                className="flex-1 bg-gray-50 dark:bg-navy-800 rounded-xl px-3 py-2 text-sm outline-none text-gray-800 dark:text-white placeholder:text-gray-400" />
              <button onClick={send} disabled={loading || !input.trim()} className="bg-navy-800 hover:bg-navy-900 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors"><Send className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
