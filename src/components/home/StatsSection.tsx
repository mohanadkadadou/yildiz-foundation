'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { GraduationCap, Users, Globe, Award } from 'lucide-react'

interface Props {
  stats: { universities: number; programs: number; students: number; countries: number }
}

function Counter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { setStarted(true) }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function StatsSection({ stats }: Props) {
  const items = [
    { icon: GraduationCap, label: 'Universities', value: stats.universities, suffix: '+', color: 'text-blue-500' },
    { icon: Users, label: 'Students Helped', value: stats.students, suffix: '+', color: 'text-gold-500' },
    { icon: Globe, label: 'Countries', value: stats.countries, suffix: '+', color: 'text-emerald-500' },
    { icon: Award, label: 'Success Rate', value: 97, suffix: '%', color: 'text-purple-500' },
  ]

  return (
    <section className="py-16 bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-navy-800 border border-gray-100 dark:border-navy-700"
            >
              <div className={`inline-flex p-3 rounded-xl bg-white dark:bg-navy-700 shadow-sm mb-4 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-1">
                <Counter end={item.value} />{item.suffix}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
