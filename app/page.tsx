'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import FloatingLines from '@/components/FloatingLines' 

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false) // FIX: Hydration Guard
  
  const supabase = createClient()
  const router = useRouter()

  // FIX: Ensures 3D engine only starts after the DOM is fully available
  useEffect(() => {
    setMounted(true)
  }, [])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), { stiffness: 100, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-4, 4]), { stiffness: 100, damping: 30 })
  const shineX = useTransform(mouseX, [-200, 200], ["0%", "100%"])
  const shineY = useTransform(mouseY, [-200, 200], ["0%", "100%"])

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(event.clientX - centerX)
    mouseY.set(event.clientY - centerY)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  // Prevent server-side rendering to avoid 'clientWidth' null error
  if (!mounted) return <div className="bg-[#020202] min-h-screen" />;

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-[#020202] relative overflow-hidden perspective-[1500px]"
      onMouseMove={handleMouseMove}
    >
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FloatingLines
          linesGradient={["#2F4BC0", "#ef2bfd", "#00030a"]}
          animationSpeed={1.7}
          interactive
        />
      </div>

      {/* Ambient Glow - Fixed with Canonical Classes */}
      <div className="fixed w-150 h-150 bg-white/2 rounded-full blur-[160px] pointer-events-none z-1"></div>

      {/* Reduced Size Login Container */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-96 px-4 z-10" 
      >
        <motion.form 
          onSubmit={handleLogin} 
          className="relative px-8 py-10 bg-white/6 backdrop-blur-[65px] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden" 
        >
          <motion.div 
            style={{ background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.1) 0%, transparent 70%)` }}
            className="absolute inset-0 pointer-events-none"
          />

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-tight text-white mb-1 uppercase">
              IV VISIT <span className="font-light opacity-50 italic">March 2026</span>
            </h1>
            <p className="text-white/40 text-[8px] font-bold uppercase tracking-[0.4em]">ECE S4 // INITIATIVE</p>
          </div>
          
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="User ID / Email" 
              className="w-full p-3.5 bg-black/40 rounded-xl border border-white/5 text-xs text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all shadow-inner"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3.5 bg-black/40 rounded-xl border border-white/5 text-xs text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all shadow-inner"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit" 
              className="w-full mt-4 bg-white/80 text-black font-black py-3.5 rounded-xl shadow-lg text-[10px] uppercase tracking-[0.3em] disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </motion.button>
          </div>
          
          <p className="text-center mt-8 text-[8px] font-bold tracking-[0.3em] text-white/10 uppercase">
            Authenticated by Marichinthikuka
          </p>
        </motion.form>
      </motion.div>

      <footer className="absolute bottom-6 w-full text-center z-10 opacity-20">
        <p className="text-[9px] font-bold tracking-[0.5em] text-white uppercase">MARICHINTHIKUKA</p>
      </footer>
    </div>
  )
}