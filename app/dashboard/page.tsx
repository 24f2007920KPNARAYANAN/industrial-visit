'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link' 
import { motion, AnimatePresence } from 'framer-motion'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const target = new Date('2026-03-23T05:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days: d > 0 ? d : 0, hours: h > 0 ? h : 0, minutes: m > 0 ? m : 0 });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/')
      const { data } = await supabase.from('classroom_records').select('*').eq('student_email', user.email).single()
      if (data?.status === 'ADMIN') router.push('/admin')
      setProfile(data); setLoading(false);
    }
    fetchProfile()
  }, [supabase, router])

  if (loading) return (
    <div style={{backgroundColor: '#E6E6FA'}} className="h-screen flex items-center justify-center font-black text-[10px] tracking-[0.5em] text-blue-600 uppercase">
       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>Synchronizing...</motion.span>
    </div>
  )

  return (
    <div style={{backgroundColor: '#E6E6FA'}} className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden font-sans">
      
      {/* Animated Mesh Backdrop */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="fixed top-[-15%] left-[-10%] w-[110%] h-[80%] rounded-full bg-blue-400/30 blur-[130px] pointer-events-none"
      />

      <div className="relative z-10 max-w-xl mx-auto py-12 px-5">
        <AnimatePresence>
        {profile && (
          <motion.div 
            initial="hidden" animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
            className="space-y-8"
          >
            {/* 1. Header & Photo */}
            <motion.div variants={{ hidden: { y: -20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="text-center space-y-4">
              <div className="relative w-28 h-28 bg-white/50 backdrop-blur-3xl border-[6px] border-white rounded-full mx-auto overflow-hidden shadow-xl">
                  {profile.photo_url ? (
                    <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-300 text-white font-black text-xl">
                      {profile.student_name?.substring(0, 1).toUpperCase()}
                    </div>
                  )}
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-800 leading-tight">Welcome, <br/>{profile.student_name}</h2>
            </motion.div>

            {/* 2. Countdown */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="bg-white/30 backdrop-blur-[40px] border border-white/90 rounded-[35px] p-6 text-center shadow-sm relative overflow-hidden">
               <p className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.4em] mb-2">IV Departure In</p>
               <div className="flex justify-center gap-6">
                  <TimeSlot val={timeLeft.days} label="Days" />
                  <TimeSlot val={timeLeft.hours} label="Hrs" />
                  <TimeSlot val={timeLeft.minutes} label="Min" />
               </div>
            </motion.div>

            {/* 3. CORE DETAILS CAPSULE */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="bg-white/20 backdrop-blur-[40px] border border-white/70 rounded-[40px] p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-center">
                <StatItem label="D.O.B" value={profile.dob || '—'} />
                <StatItem label="Age" value={profile.age || '—'} />
                <StatItem label="Place" value={profile.place || '—'} />
                <StatItem label="Blood Group" value={profile.blood_group || '—'} isHighlight />
                <div className="col-span-2 pt-4 border-t border-white/20">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Aadhar Number</p>
                   <p className="text-xl font-black text-slate-800 tracking-widest">{profile.aadhar_number || '0000 0000 0000'}</p>
                </div>
              </div>
            </motion.div>

            {/* 4. FAMILY & GUARDIANS */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="bg-white/25 backdrop-blur-[40px] border border-white/80 rounded-[40px] p-8 shadow-sm">
              <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6 text-center">Guardian Records</h3>
              <div className="space-y-6">
                <GuardianItem name={profile.father_name} phone={profile.father_mobile} label="Father" />
                <div className="h-[1px] bg-blue-500/10 w-full"></div>
                <GuardianItem name={profile.mother_name} phone={profile.mother_mobile} label="Mother" />
              </div>
            </motion.div>

            {/* 5. MEDICAL NOTES */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="bg-red-500/5 backdrop-blur-[40px] border border-white/60 rounded-[40px] p-8 shadow-sm">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">Health & Medical Notes</h3>
              <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{profile.health_issues || 'No reported health issues.'}</p>
            </motion.div>

            {/* 6. Financial Overview */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="bg-white/15 backdrop-blur-[100px] border border-white/95 rounded-[50px] shadow-lg overflow-hidden relative">
                <div className="p-8 border-b border-white/30 bg-white/10 text-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Financial Breakdown</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="pb-4 border-b border-white/20">
                      <PaymentStatus label="Remaining Amount" amount="₹2675" isPaid={profile.remaining_amount_paid} isPrimary />
                    </div>
                    <PaymentStatus label="Train Fees" amount="₹429" isPaid={profile.train_fees_paid} />
                    <PaymentStatus label="Advance" amount="₹95" isPaid={profile.advance_paid} />
                    <PaymentStatus label="Initial amount" amount="₹1000" isPaid={profile.initial_amount_paid} />
                </div>
            </motion.div>

            {/* FOOTER ACTIONS: PORTAL & SIGN OUT */}
            <motion.footer variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="mt-16 text-center flex flex-col items-center gap-6 pb-12">
                
                {/* --- NEW: THE MINI GLASS PORTAL CAPSULE --- */}
                <Link href="/dashboard/expedition">
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.6)" }} 
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 bg-white/30 backdrop-blur-3xl border border-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 shadow-sm transition-all"
                  >
                    IV DETAILS
                  </motion.button>
                </Link>

                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => supabase.auth.signOut().then(() => router.push('/'))} 
                  className="px-14 py-4 bg-white/40 backdrop-blur-3xl border border-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 shadow-md"
                >
                  Sign Out
                </motion.button>
            </motion.footer>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Sub-components
function TimeSlot({ val, label }: { val: number, label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-black text-slate-800 tracking-tighter">{val}</span>
      <span className="text-[7px] font-bold text-blue-400/70 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function StatItem({ label, value, isHighlight }: { label: string, value: string, isHighlight?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      <p className={`text-sm font-black tracking-tight ${isHighlight ? 'text-blue-500' : 'text-slate-700'}`}>{value}</p>
    </div>
  )
}

function GuardianItem({ name, phone, label }: { name: string, phone: string, label: string }) {
  return (
    <div className="flex justify-between items-center text-left">
      <div>
        <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">{label}</p>
        <p className="text-sm font-black text-slate-800 tracking-tight">{name || 'Not Provided'}</p>
      </div>
      <p className="text-[11px] font-black text-slate-500 tracking-widest">{phone || '—'}</p>
    </div>
  )
}

function PaymentStatus({ label, amount, isPaid, isPrimary }: { label: string, amount: string, isPaid: boolean, isPrimary?: boolean }) {
  return (
    <motion.div whileHover={{ x: 5 }} className="flex justify-between items-center gap-4">
      <div className="text-left">
        <p className={`${isPrimary ? 'text-xl' : 'text-base'} font-black text-slate-800 tracking-tighter`}>{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{amount}</p>
      </div>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 ${isPaid ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
        <div className={`w-2 h-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isPaid ? 'Paid' : 'Unpaid'}</span>
      </div>
    </motion.div>
  )
}