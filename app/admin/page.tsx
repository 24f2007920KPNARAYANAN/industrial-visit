'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function AdminDashboard() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('Admin')

  // 1. Vision Pro Mouse Tracking Physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for premium 3D movement
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [7, -7]), { stiffness: 120, damping: 25 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-7, 7]), { stiffness: 120, damping: 25 })

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(event.clientX - centerX)
    mouseY.set(event.clientY - centerY)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return window.location.assign('/') 

      const { data: profile } = await supabase
        .from('classroom_records')
        .select('student_name, status')
        .eq('student_email', user.email)
        .maybeSingle()

      if (profile?.status !== 'ADMIN') return window.location.assign('/dashboard')

      setAdminName(profile.student_name)
      setLoading(false)
    }
    verifyAdmin()
  }, []) // Stable dependency array

  if (loading) return (
    <div style={{backgroundColor: '#E6E6FA'}} className="h-screen flex items-center justify-center font-black text-purple-400 uppercase tracking-[0.4em]">
       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>Synchronizing...</motion.span>
    </div>
  )

  return (
    <div 
      style={{ backgroundColor: '#E6E6FA', minHeight: '100vh', width: '100%' }} 
      className="flex flex-col items-center justify-center py-12 px-6 font-sans relative overflow-hidden perspective-[1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 2. Deep Mesh Backdrop */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[140px] pointer-events-none"
      />

      {/* 3. Floating Profile Header */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-20 flex flex-col items-center mb-16 text-center"
      >
        <motion.div 
          className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-2xl border-[0.5px] border-white/60 shadow-2xl flex items-center justify-center mb-6 overflow-hidden"
          style={{ transform: "translateZ(60px)" }} 
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-indigo-500 to-red-400 flex items-center justify-center">
            <span className="text-white font-black text-2xl tracking-tighter">
              {adminName.substring(0, 2).toUpperCase()}
            </span>
          </div>
        </motion.div>
        
        <h1 
          style={{ transform: "translateZ(40px)" }} 
          className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2"
        >
          ADMIN PORTAL
        </h1>
        <p 
          style={{ transform: "translateZ(30px)" }} 
          className="text-[10px] font-black text-purple-600 uppercase tracking-[0.5em] opacity-70"
        >
          {adminName}
        </p>
      </motion.div>

      {/* 4. Glowing Glass Grid */}
      <motion.div 
        className="relative z-10 w-full max-w-2xl grid grid-cols-2 gap-4 md:gap-8"
        initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        <GlassCard 
          href="/admin/list" 
          label="Records" 
          sub="Access Database" 
          color="red" 
          rotateX={rotateX} rotateY={rotateY} 
          mouseX={mouseX} mouseY={mouseY} 
        />
        
        <GlassCard 
          href="/admin/documents" 
          label="Vault" 
          sub="Secured Files" 
          color="purple" 
          rotateX={rotateX} rotateY={rotateY} 
          mouseX={mouseX} mouseY={mouseY} 
        />

        <GlassCard 
          href="/admin/boarding" 
          label="Boarding" 
          sub="Pickup Spots" 
          color="blue" 
          rotateX={rotateX} rotateY={rotateY} 
          mouseX={mouseX} mouseY={mouseY} 
        />

        <GlassCard 
          href="/admin/headcount" 
          label="Head Count" 
          sub="Live Attendance" 
          color="emerald" 
          rotateX={rotateX} rotateY={rotateY} 
          mouseX={mouseX} mouseY={mouseY} 
        />
      </motion.div>

      {/* 5. Ruby Glass Sign Out with Vision Pro Glow */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-[180px] relative group mt-16"
      >
        <div className="absolute inset-0 bg-red-500/0 blur-[35px] rounded-[30px] group-hover:bg-red-500/20 transition-all duration-700 pointer-events-none"></div>
        <div className="absolute inset-0 bg-red-400/0 blur-[15px] rounded-[30px] group-hover:bg-red-400/30 group-hover:scale-110 transition-all duration-700 pointer-events-none"></div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={async () => { await supabase.auth.signOut(); window.location.assign('/'); }}
          className="w-full py-5 relative overflow-hidden bg-red-500/10 backdrop-blur-2xl border-[0.5px] border-white/30 rounded-[30px] font-black text-[10px] text-red-600 uppercase tracking-[0.4em] shadow-xl transition-all group-hover:border-red-400/50 group-hover:text-red-500"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40"></div>
          <span className="relative z-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">Sign Out</span>
        </motion.button>
      </motion.div>

      <footer className="relative z-10 mt-16 text-[8px] font-black text-purple-600/40 uppercase tracking-[0.5em]">
        MARICHINTHIKUKA
      </footer>
    </div>
  )
}

function GlassCard({ href, label, sub, color, rotateX, rotateY, mouseX, mouseY }: any) {
  const shineX = useTransform(mouseX, [-200, 200], ["0%", "100%"])
  const shineY = useTransform(mouseY, [-200, 200], ["0%", "100%"])

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <NextLink href={href} className="block group h-full">
        <motion.div 
          className="h-full bg-white/10 backdrop-blur-[45px] border-[0.5px] border-white/40 p-10 rounded-[45px] shadow-[0_40px_80px_rgba(0,0,0,0.12)] relative overflow-hidden flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-white/20"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Specular Shine Overlay */}
          <motion.div 
            style={{ 
              background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.5) 0%, transparent 70%)` 
            }}
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* INNER GLOW ICON SECTION */}
          <div className="relative mb-6">
            <div className={`absolute inset-0 bg-${color}-500/30 blur-[30px] rounded-full group-hover:bg-${color}-500/50 transition-all duration-700`}></div>
            <div className={`absolute inset-0 bg-${color}-400/20 blur-[10px] rounded-full group-hover:scale-150 transition-all duration-700`}></div>

            <div className="relative w-16 h-16 bg-white/15 backdrop-blur-md border border-white/50 rounded-2xl flex items-center justify-center shadow-[inset_0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 group-hover:border-white/80 transition-all duration-500">
              
              {label === "Records" && (
                <svg className="w-8 h-8 text-red-500" style={{ filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.7))" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              )}

              {label === "Vault" && (
                <svg className="w-8 h-8 text-purple-500" style={{ filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.7))" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}

              {label === "Boarding" && (
                <svg className="w-8 h-8 text-blue-500" style={{ filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.7))" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}

              {label === "Head Count" && (
                <svg className="w-8 h-8 text-emerald-500" style={{ filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.7))" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}

            </div>
          </div>

          <h2 className={`text-base font-black text-slate-800 mb-1 group-hover:text-${color}-600 transition-colors`}>{label}</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
        </motion.div>
      </NextLink>
    </motion.div>
  )
}