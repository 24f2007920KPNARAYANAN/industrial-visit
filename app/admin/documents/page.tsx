'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DocumentVault() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  // Your verified storage links
  const commonFiles = [
    { 
      name: "IV Excel Sheet", 
      type: "XLSX", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/IV.xlsx" 
    },
    { 
      name: "Advance Proof", 
      type: "JPEG", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/Advance_proof.jpeg" 
    },
    { 
      name: "Payment Copy", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/Copy%20of%20Payment.pdf" 
    },
    { 
      name: "Initial Allowance", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/Initial_principle_allowance.pdf" 
    },
    { 
      name: "DRIVERS DETAILS", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/DRIVER%20DETAILS.pdf" 
    },
    { 
      name: "PERMIT", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/PERMIT.pdf" 
    },
    { 
      name: "PARENT PERMISSION", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/PARENT%20PERMISSION.pdf" 
    },
    { 
      name: "HOSTEL PERMISSION FORM", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/HOSTEL%20PERMISSION%20FORM.pdf" 
    },
    { 
      name: "BOARDING AND LODGING DETAILS", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/BOARDING%20AND%20LODGING%20DETAILS.pdf" 
    },
    { 
      name: "SCHEDULE OF VISIT", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/SCHEDULE%20OF%20VISIT.pdf" 
    },
    { 
      name: "CONFIRMATION OF IV", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/CONFIRMATION%20OF%20IV.pdf" 
    },
    { 
      name: "STUDENTS LIST", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/STUDENTS%20LIST.pdf" 
    },
    { 
      name: "IV APPLICATION FORM", 
      type: "PDF", 
      url: "https://efkhiinrjcbmunjhnvmt.supabase.co/storage/v1/object/public/iv-documents/IV%20APPLICATION%20FORM.pdf" 
    },
  ]

  useEffect(() => {
    const secureAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/')

      const { data: profile } = await supabase
        .from('classroom_records')
        .select('status')
        .eq('student_email', user.email)
        .single()

      if (profile?.status === 'STUDENT') {
        alert("Access Denied: Admin Clearance Required.")
        return router.push('/dashboard')
      }

      setDocs(commonFiles)
      setLoading(false)
    }
    secureAccess()
  }, [])

  if (loading) return (
    <div style={{backgroundColor: '#E6E6FA'}} className="h-screen flex items-center justify-center font-black text-[10px] tracking-[0.5em] text-purple-400 uppercase">
      Opening Secure Vault...
    </div>
  )

  return (
    <div 
      style={{ backgroundColor: '#E6E6FA', minHeight: '100vh' }} 
      className="w-full relative overflow-y-auto font-sans"
    >
      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] right-[-15%] w-[80%] h-[70%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-400/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-xl mx-auto py-16 px-6">
        <div className="flex justify-between items-center mb-12">
          <Link href="/admin" className="px-5 py-2 bg-white/30 backdrop-blur-md border border-white/50 rounded-full text-[9px] font-black uppercase tracking-widest text-purple-600 hover:bg-white/50 transition-all shadow-sm">
            ← Dashboard
          </Link>
          <div className="text-right">
            <h2 className="text-2xl font-black tracking-tighter text-slate-800">Document Vault</h2>
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">Sapphire Repository</p>
          </div>
        </div>

        <div className="space-y-6">
          {docs.map((doc, index) => (
            <div key={index} className="relative bg-white/20 backdrop-blur-[25px] border border-white/40 rounded-[35px] p-8 shadow-sm flex items-center justify-between group hover:bg-blue-500/5 transition-all duration-500">
              {/* Edge Reflection Line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40 rounded-t-[35px]"></div>
              
              <div className="flex items-center gap-5">
                {/* Sapphire Glowing Icon */}
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-400/20 shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                </div>
                <div>
                  <h3 className="font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{doc.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-300/30 uppercase tracking-widest">
                      {doc.type}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Verified Link</span>
                  </div>
                </div>
              </div>
              
              {/* Glass Action Button */}
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-md active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-[8px] font-black text-purple-400/40 uppercase tracking-[0.6em]">
          MARICHINTIKUKA
        </p>
      </div>
    </div>
  )
}