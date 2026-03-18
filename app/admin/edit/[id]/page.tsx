'use client'
import { useEffect, useState, use } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function EditPerson({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [person, setPerson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const secureFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/')

      const { data: profile } = await supabase
        .from('classroom_records')
        .select('status')
        .eq('student_email', user.email)
        .single()

      if (profile?.status === 'STUDENT') {
        alert("Unauthorized: Admins only")
        return router.push('/dashboard')
      }

      const { data } = await supabase
        .from('classroom_records')
        .select('*')
        .eq('id', id)
        .single()
        
      if (data) setPerson(data)
      setLoading(false)
    }
    secureFetch()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('classroom_records').update(person).eq('id', id)
    if (!error) {
      alert("Record Synchronized")
      router.push('/admin/list')
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{backgroundColor: '#E6E6FA'}} className="h-screen flex items-center justify-center font-black text-[10px] tracking-[0.5em] text-purple-400 uppercase">
      Opening File...
    </div>
  )

  return (
    <div 
      style={{ backgroundColor: '#E6E6FA', minHeight: '100vh' }} 
      className="w-full relative overflow-y-auto font-sans p-6 selection:bg-blue-100"
    >
      <div className="fixed top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto space-y-8 pb-12">
        <button 
          onClick={() => router.back()} 
          className="px-5 py-2 bg-white/30 backdrop-blur-md border border-white/50 rounded-full text-[9px] font-black uppercase tracking-widest text-purple-600 hover:bg-white/50 transition-all shadow-sm"
        >
          ← Cancel
        </button>
        
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleUpdate} 
          className="bg-white/20 backdrop-blur-[25px] border border-white/40 rounded-[45px] p-10 shadow-sm relative overflow-hidden space-y-10"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40 rounded-t-[45px]"></div>

          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-black tracking-tighter text-slate-800 italic">STUDENT <span className="text-blue-600">LIST</span></h2>
            <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.4em]">Marichinthikuka</p>
          </div>

          {/* SECTION 1: CORE DATA */}
          <div className="space-y-5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Identity & Status</p>
            <InputField label="Full Name" value={person.student_name} onChange={(v) => setPerson({...person, student_name: v})} />
            
            <div className="grid grid-cols-2 gap-4">
               <InputField label="University ID" value={person.university_id} onChange={(v) => setPerson({...person, university_id: v})} />
               <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Status</label>
                  <select 
                    value={person.status} 
                    onChange={(e) => setPerson({...person, status: e.target.value})}
                    className="w-full bg-white/40 border border-white/60 rounded-2xl px-4 py-3.5 text-xs font-black text-slate-700 outline-none uppercase tracking-widest"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="FACULTY">FACULTY</option>
                  </select>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Age" value={person.age} onChange={(v) => setPerson({...person, age: v})} />
                <InputField label="Blood Group" value={person.blood_group} placeholder="e.g. B+ve" onChange={(v) => setPerson({...person, blood_group: v})} />
            </div>
          </div>

          {/* SECTION 2: PARENTAL CONTACTS */}
          <div className="pt-8 border-t border-white/20 space-y-5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Guardian Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Father's Name" value={person.father_name} onChange={(v) => setPerson({...person, father_name: v})} />
              <InputField label="Father's Mobile" value={person.father_mobile} onChange={(v) => setPerson({...person, father_mobile: v})} />
              <InputField label="Mother's Name" value={person.mother_name} onChange={(v) => setPerson({...person, mother_name: v})} />
              <InputField label="Mother's Mobile" value={person.mother_mobile} onChange={(v) => setPerson({...person, mother_mobile: v})} />
            </div>
          </div>

          {/* SECTION 3: HEALTH & ID */}
          <div className="pt-8 border-t border-white/20 space-y-5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Medical & Government ID</p>
            <InputField label="Aadhar Number" value={person.aadhar_number} onChange={(v) => setPerson({...person, aadhar_number: v})} />
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Health Issues</label>
              <textarea 
                value={person.health_issues || ''} 
                onChange={(e) => setPerson({...person, health_issues: e.target.value})}
                placeholder="List allergies or medical conditions..."
                className="w-full bg-white/30 border border-white/60 rounded-[30px] px-5 py-4 text-xs font-bold text-slate-700 outline-none focus:bg-white/60 transition-all min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* SECTION 4: PAYMENTS */}
          <div className="pt-8 border-t border-white/20 space-y-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Payment Verification</p>
            <Toggle label="Remaining Balance (₹2625)" active={person.remaining_amount_paid} onToggle={() => setPerson({...person, remaining_amount_paid: !person.remaining_amount_paid})} isPrimary />
            <div className="grid grid-cols-1 gap-3 pt-2">
              <Toggle label="Train Fees (₹429)" active={person.train_fees_paid} onToggle={() => setPerson({...person, train_fees_paid: !person.train_fees_paid})} />
              <Toggle label="Advance (₹95)" active={person.advance_paid} onToggle={() => setPerson({...person, advance_paid: !person.advance_paid})} />
              <Toggle label="Initial Amount (₹1000)" active={person.initial_amount_paid} onToggle={() => setPerson({...person, initial_amount_paid: !person.initial_amount_paid})} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-5 bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-95"
          >
            {saving ? 'Synchronizing Archive...' : 'Push Updates'}
          </button>
        </motion.form>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder = "" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
      <input 
        type="text" 
        value={value || ''} 
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/30 border border-white/60 rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 outline-none focus:bg-white/60 transition-all placeholder:text-slate-400/50"
      />
    </div>
  )
}

function Toggle({ label, active, onToggle, isPrimary }: { label: string, active: boolean, onToggle: () => void, isPrimary?: boolean }) {
  return (
    <div className={`flex justify-between items-center p-5 rounded-[25px] border ${isPrimary ? 'bg-blue-500/5 border-blue-400/40 shadow-inner' : 'bg-white/10 border-white/40'}`}>
      <span className={`text-[10px] font-black uppercase tracking-tight ${isPrimary ? 'text-blue-600' : 'text-slate-700'}`}>{label}</span>
      <button 
        type="button"
        onClick={onToggle}
        className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
          active ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-200 text-slate-500'
        }`}
      >
        {active ? 'Paid' : 'Unpaid'}
      </button>
    </div>
  )
}