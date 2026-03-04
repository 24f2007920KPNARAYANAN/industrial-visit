'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type PaymentFilter = 'ALL' | 'UNPAID_REMAINING' | 'UNPAID_TRAIN' | 'UNPAID_INITIAL' | 'UNPAID_ADVANCE'

export default function PeopleList() {
  const [people, setPeople] = useState<any[]>([])
  const [filteredPeople, setFilteredPeople] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>('ALL') // Filter State
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchAndSecure = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/')

      const { data: profile } = await supabase
        .from('classroom_records')
        .select('status')
        .eq('student_email', user.email)
        .single()

      if (profile?.status === 'STUDENT') {
        alert("Access Denied")
        return router.push('/dashboard')
      }

      const { data } = await supabase
        .from('classroom_records')
        .select('*')
        .order('student_name', { ascending: true })

      if (data) {
        setPeople(data)
        setFilteredPeople(data)
      }
      setLoading(false)
    }
    fetchAndSecure()
  }, [supabase, router])

  // Enhanced Filter Logic
  useEffect(() => {
    let results = people

    // 1. Apply Payment Filter
    if (activeFilter === 'UNPAID_REMAINING') results = results.filter(p => !p.remaining_amount_paid)
    if (activeFilter === 'UNPAID_TRAIN') results = results.filter(p => !p.train_fees_paid)
    if (activeFilter === 'UNPAID_INITIAL') results = results.filter(p => !p.initial_amount_paid)
    if (activeFilter === 'UNPAID_ADVANCE') results = results.filter(p => !p.advance_paid)

    // 2. Apply Search Query
    results = results.filter(person => 
      person.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.university_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.blood_group?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredPeople(results)
  }, [searchQuery, activeFilter, people])

  if (loading) return (
    <div style={{backgroundColor: '#E6E6FA'}} className="h-screen flex items-center justify-center font-black text-[10px] tracking-[0.5em] text-purple-400 uppercase">
      Accessing Database...
    </div>
  )

  return (
    <div style={{ backgroundColor: '#E6E6FA', minHeight: '100vh' }} className="w-full relative overflow-y-auto font-sans">
      <div className="relative z-10 max-w-2xl mx-auto py-12 px-6">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-10">
          <Link href="/admin" className="px-5 py-2 bg-white/30 backdrop-blur-md border border-white/50 rounded-full text-[9px] font-black uppercase tracking-widest text-purple-600">← Dashboard</Link>
          <div className="text-right">
            <h2 className="text-2xl font-black tracking-tighter text-slate-800">STUDENT LIST</h2>
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">Filter: {activeFilter.replace('_', ' ')}</p>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-10">
          <input 
            type="text"
            placeholder="Search name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-2xl border border-white/40 rounded-[25px] px-12 py-5 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400 shadow-sm"
          />

          {/* New Filter Chip Row */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            <FilterChip label="All" active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
            <FilterChip label="Unpaid Bal (₹2455)" active={activeFilter === 'UNPAID_REMAINING'} onClick={() => setActiveFilter('UNPAID_REMAINING')} color="red" />
            <FilterChip label="Unpaid Train" active={activeFilter === 'UNPAID_TRAIN'} onClick={() => setActiveFilter('UNPAID_TRAIN')} color="red" />
            <FilterChip label="Unpaid Initial" active={activeFilter === 'UNPAID_INITIAL'} onClick={() => setActiveFilter('UNPAID_INITIAL')} color="red" />
          </div>
        </div>

        {/* Student Cards */}
        <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {filteredPeople.map((person) => (
              <motion.div 
                layout
                key={person.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white/25 backdrop-blur-[25px] border border-white/50 rounded-[35px] p-6 shadow-sm flex flex-col gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/40 border border-white/60 overflow-hidden flex-shrink-0 relative">
                      {person.photo_url ? <img src={person.photo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-blue-400 font-black text-white text-xs">{person.student_name?.charAt(0)}</div>}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 tracking-tight">{person.student_name}</h3>
                      <div className="flex flex-wrap gap-2 items-center mt-1">
                        <PaymentBadge label="Bal" paid={person.remaining_amount_paid} />
                        <PaymentBadge label="Train" paid={person.train_fees_paid} />
                        <span className="text-[10px] text-slate-400 font-bold">{person.university_id}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/edit/${person.id}`} className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">Edit</Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

// Sub-components
function FilterChip({ label, active, onClick, color = "blue" }: { label: string, active: boolean, onClick: () => void, color?: "blue" | "red" }) {
  return (
    <button 
      onClick={onClick}
      className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
        active 
          ? (color === "red" ? 'bg-red-500 text-white border-red-400' : 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20') 
          : 'bg-white/40 text-slate-500 border-white/60 hover:bg-white/60'
      }`}
    >
      {label}
    </button>
  )
}

function PaymentBadge({ label, paid }: { label: string, paid: boolean }) {
  return (
    <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter border ${paid ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
      {label}: {paid ? '✓' : '✗'}
    </div>
  )
}