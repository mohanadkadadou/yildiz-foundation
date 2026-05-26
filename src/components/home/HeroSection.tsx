'use client'
// src/components/home/HeroSection.tsx
import { motion } from 'framer-motion'
import { Search, MapPin, GraduationCap, Star, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/universities?q=${encodeURIComponent(query)}`)
    }
  }

  const quickLinks = [
    { label: 'Medicine', href: '/universities?major=medicine', icon: '🏥' },
    { label: 'Engineering', href: '/universities?major=engineering', icon: '⚙️' },
    { label: 'Business', href: '/universities?major=business', icon: '📊' },
    { label: 'Law', href: '/universities?major=law', icon: '⚖️' },
    { label: 'Architecture', href: '/universities?major=architecture', icon: '🏛️' },
    { label: 'Computer Science', href: '/universities?major=cs', icon: '💻' },
  ]

  const floatingCards = [
    { top: '15%', left: '5%', delay: 0, content: { title: 'Istanbul University', rank: '#1 in Turkey', color: 'from-blue-600 to-blue-800' } },
    { top: '60%', left: '3%', delay: 0.5, content: { title: '50% Scholarship', subtitle: 'Available Now', color: 'from-gold-500 to-gold-600' } },
    { top: '20%', right: '4%', delay: 0.3, content: { title: '2,500+ Students', subtitle: 'Placed Successfully', color: 'from-emerald-600 to-emerald-800' } },
  ]

  return (
    <section className="hero-bg min-h-screen flex items-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl top-[-100px] right-[-100px] animate-float" />
        <div className="absolute w-64 h-64 rounded-full bg-gold-400/10 blur-3xl bottom-[-50px] left-[-50px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute w-48 h-48 rounded-full bg-blue-300/5 blur-2xl top-1/2 left-1/3" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Floating cards */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute top-[20%] left-[3%] bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Istanbul University</div>
              <div className="text-gold-400 text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> #1 in Turkey
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="absolute top-[25%] right-[3%] bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl"
        >
          <div className="text-white font-bold text-2xl">2,500+</div>
          <div className="text-blue-200 text-xs">Students Placed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-[25%] left-[5%] bg-gradient-to-br from-gold-500/20 to-gold-600/20 backdrop-blur-md rounded-2xl p-4 border border-gold-400/30 shadow-2xl"
        >
          <div className="text-gold-400 font-bold text-lg">Up to 75%</div>
          <div className="text-white text-xs">Scholarship Available</div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white rounded-2xl p-3 shadow-2xl">
              <Image src="/images/logo.png" alt="Yildiz Foundation" width={180} height={60} className="h-14 w-auto" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full px-5 py-2 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            Turkey&apos;s #1 Educational Consultancy
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Your Gateway to{' '}
            <span className="relative">
              <span className="text-gold-400">Turkish Universities</span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Discover top universities, compare programs, and get expert guidance to start your academic journey in Turkey.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-center bg-white dark:bg-navy-800 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <Search className="w-5 h-5 text-gray-400 ml-5 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search universities, programs, cities..."
                className="flex-1 px-4 py-5 text-gray-800 dark:text-white bg-transparent outline-none text-lg placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="m-2 bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-800 hover:to-navy-900 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Quick search links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <span className="text-blue-200 text-sm py-2">Popular:</span>
            {quickLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border border-white/10 hover:border-white/30"
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/universities"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-gold-500/30 hover:shadow-xl text-lg"
            >
              <GraduationCap className="w-5 h-5" />
              Explore Universities
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 border border-white/30 hover:border-white/50 text-lg"
            >
              <MapPin className="w-5 h-5" />
              Free Consultation
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80H1440V40C1440 40 1200 0 720 0C240 0 0 40 0 40V80Z" fill="white" className="dark:fill-navy-950" />
        </svg>
      </div>
    </section>
  )
}
