'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ViewerDashboard() {
  const [people, setPeople] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const gatekeeper = async () => {
      // 1. Get the logged-in user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/')

      // 2. Fetch their status from your table
      const { data: profile } = await supabase
        .from('classroom_records')
        .select('status')
        .eq('student_email', user.email)
        .single()

      // 3. Kick them out if they are a STUDENT
      if (profile?.status === 'STUDENT') {
        alert("Unauthorized Access: Viewer portal is for Faculty/Parents only.")
        return router.push('/dashboard')
      }

      // 4. Fetch the list of people for display
      const { data: records } = await supabase
        .from('classroom_records')
        .select('*')
        .order('student_name', { ascending: true })

      if (records) setPeople(records)
      setLoading(false)
    }

    gatekeeper()
  }, [supabase, router])

  if (loading) return (
    <div className="bg-[#f0f9ff] h-screen flex items-center justify-center font-black text-[10px] tracking-[0.5em] text-blue-400 uppercase">
      Accessing Faculty Portal...
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-[#f0f9ff] relative overflow-y-auto font-sans">
      <style jsx global>{`
        @keyframes one-time-shine {
          0% { left: -150%; opacity: 0; }
          20% { opacity: 0.8; }
          100% { left: 150%; opacity: 0; }
        }
        .glass-shine-once {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
          transform: skewX(-20deg);
          animation: one-time-shine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          pointer-events: none;
        }
      `}</style>

      {/* Blue Tinted Mesh Background */}
      <div className="fixed top-[-10%] left-[-15%] w-[80%] h-[70%] rounded-full bg-blue-200/30 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-5%] right-[-10%] w-[70%] h-[60%] rounded-full bg-indigo-100/40 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-tighter text-slate-800">IV Overview</h2>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-2">Faculty & Parent Portal</p>
        </div>

        <div className="space-y-4">
          {people.map((person, index) => (
            <div key={person.id} className="bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[30px] p-6 shadow-sm flex items-center justify-between relative overflow-hidden group">
              {/* Subtle shine effect for each row */}
              <div className="glass-shine-once" style={{ animationDelay: `${index * 0.1}s` }}></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/60 border-2 border-white flex items-center justify-center text-[11px] font-black text-blue-400 shadow-inner">
                  {person.photo_url ? (
                    <img src={person.photo_url} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    person.student_name?.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 tracking-tight text-sm">{person.student_name}</h3>
                  <div className="flex gap-2">
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{person.university_id || 'NO-ID'}</span>
                  </div>
                </div>
              </div>
              
              {/* Read-Only Status Indicators */}
              <div className="flex gap-3 relative z-10">
                <StatusDot label="Train" active={person.train_fees_paid} />
                <StatusDot label="Adv." active={person.advance_paid} />
                <StatusDot label="Init." active={person.initial_amount_paid} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center space-y-6">
            <Link href="/admin/documents" className="inline-block px-10 py-4 bg-white/50 backdrop-blur-md rounded-[24px] text-[9px] font-black uppercase tracking-widest text-blue-500 border border-white hover:bg-white/80 transition-all shadow-sm">
                Access Document Vault
            </Link>
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="block w-full text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-600 transition-colors">
                Sign Out
            </button>
        </div>
      </div>
    </div>
  )
}

function StatusDot({ active, label }: { active: boolean, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-colors duration-500 ${active ? 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-slate-200'}`}></div>
      <span className="text-[6px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    </div>
  )
}