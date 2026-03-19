'use client'
import { motion } from 'framer-motion'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

interface Student {
  id: number;
  name: string;
  counts: boolean[];
}

// 1. Move the default list OUTSIDE the component so it's a fixed baseline
const emptyCounts = Array(8).fill(false)
const DEFAULT_STUDENTS: Student[] = [
  { id: 1, name: "ABHINAV S", counts: [...emptyCounts] },
  { id: 2, name: "ABHISHEK CV", counts: [...emptyCounts] },
  { id: 3, name: "ADITHYA SAHADEVAN", counts: [...emptyCounts] },
  { id: 4, name: "AGNEYA ANI S", counts: [...emptyCounts] },
  { id: 5, name: "AKASH ANIL", counts: [...emptyCounts] },
  { id: 6, name: "AKHIL A V", counts: [...emptyCounts] },
  { id: 7, name: "AMAL KRISHNAN", counts: [...emptyCounts] },
  { id: 8, name: "ANEESHMA C", counts: [...emptyCounts] },
  { id: 9, name: "ANJIMA RAJ", counts: [...emptyCounts] },
  { id: 10, name: "ANLIYA JOSE", counts: [...emptyCounts] },
  { id: 11, name: "ANUSREE EK", counts: [...emptyCounts] },
  { id: 12, name: "APARNA DINURAJ", counts: [...emptyCounts] },
  { id: 13, name: "AROMAL PREMAN", counts: [...emptyCounts] },
  { id: 14, name: "ATHUL TOM ", counts: [...emptyCounts] },
  { id: 15, name: "BIBIN BINU", counts: [...emptyCounts] },
  { id: 16, name: "DEVAPRIYA DAS P", counts: [...emptyCounts] },
  { id: 17, name: "DRUPATH RAMESH ", counts: [...emptyCounts] },
  { id: 18, name: "GAYATHRI TS", counts: [...emptyCounts] },
  { id: 19, name: "GAYATRI P", counts: [...emptyCounts] },
  { id: 20, name: "HANIMA SUDHEEP", counts: [...emptyCounts] },
  { id: 21, name: "HARITHA K", counts: [...emptyCounts] },
  { id: 22, name: "JASIM VP", counts: [...emptyCounts] },
  { id: 23, name: "JITHYA J", counts: [...emptyCounts] },
  { id: 24, name: "K P NARAYANAN", counts: [...emptyCounts] },
  { id: 25, name: "KEERTHI PP", counts: [...emptyCounts] },
  { id: 26, name: "LENA JOLLY", counts: [...emptyCounts] },
  { id: 27, name: "MARIYA MATHEW", counts: [...emptyCounts] },
  { id: 28, name: "MEJO MATHEW", counts: [...emptyCounts] },
  { id: 29, name: "METILDA VINOD", counts: [...emptyCounts] },
  { id: 30, name: "MUHAMMED RISHAL C", counts: [...emptyCounts] },
  { id: 31, name: "MUHAMMED SINAN PH", counts: [...emptyCounts] },
  { id: 32, name: "MUHAMMED ZAJIL MA", counts: [...emptyCounts] },
  { id: 33, name: "NANDAKISHOR M", counts: [...emptyCounts] },
  { id: 34, name: "NANDANA ASHOK", counts: [...emptyCounts] },
  { id: 35, name: "NANDANA T", counts: [...emptyCounts] },
  { id: 36, name: "NAVANEETH P", counts: [...emptyCounts] },
  { id: 37, name: "NEHA MARIA JOY", counts: [...emptyCounts] },
  { id: 38, name: "NIRANJANA VS", counts: [...emptyCounts] },
  { id: 39, name: "NIYAMIKA M NAMBIAR", counts: [...emptyCounts] },
  { id: 40, name: "PADMA JYOTHISH", counts: [...emptyCounts] },
  { id: 41, name: "RICHU THOMAS", counts: [...emptyCounts] },
  { id: 42, name: "RITHUL MURALIDHARAN", counts: [...emptyCounts] },
  { id: 43, name: "SAMITH A", counts: [...emptyCounts] },
  { id: 44, name: "SANJANA C", counts: [...emptyCounts] },
  { id: 45, name: "SANJAY SIVAPRASAD", counts: [...emptyCounts] },
  { id: 46, name: "SHAHLA C H", counts: [...emptyCounts] },
  { id: 47, name: "SNIGDHA P AJAY", counts: [...emptyCounts] },
  { id: 48, name: "SOURAV K V", counts: [...emptyCounts] },
  { id: 49, name: "THANMAY SUDEV", counts: [...emptyCounts] },
  { id: 50, name: "TOM CHRIST GEORGE", counts: [...emptyCounts] },
  { id: 51, name: "VEDA P V", counts: [...emptyCounts] },
  { id: 52, name: "YASH KIRAN VP", counts: [...emptyCounts] },
]

export default function MasterHeadcountPage() {
  // 2. Initialize strictly with default data so Server and Client perfectly match
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS)
  const [isLoaded, setIsLoaded] = useState(false)

  // 3. Load from Local Storage AFTER hydration is complete
  useEffect(() => {
    const saved = localStorage.getItem('techmaghi_matrix_log')
    if (saved) {
      const parsedSaved = JSON.parse(saved)
      // Safety Check: Only load memory if the lengths match. 
      // This prevents your old 16-student list from overwriting the 52-student list!
      if (parsedSaved.length === DEFAULT_STUDENTS.length) {
        setStudents(parsedSaved)
      } else {
        localStorage.setItem('techmaghi_matrix_log', JSON.stringify(DEFAULT_STUDENTS))
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to memory every time you tap a button (only active after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('techmaghi_matrix_log', JSON.stringify(students))
    }
  }, [students, isLoaded])

  const toggleCount = (studentId: number, countIndex: number) => {
    setStudents(students.map((student) => {
      if (student.id === studentId) {
        const newCounts = [...student.counts]
        newCounts[countIndex] = !newCounts[countIndex]
        return { ...student, counts: newCounts }
      }
      return student
    }))
  }

  const columnTotals = Array(8).fill(0).map((_, index) => {
    return students.filter(student => student.counts[index] === true).length
  })

  // Optional: Prevent flickering by hiding the list until hydration is complete
  if (!isLoaded) return null 

  return (
    <div 
      style={{ backgroundColor: '#E6E6FA', minHeight: '100vh', width: '100%' }} 
      className="flex flex-col items-center py-8 md:py-12 px-3 md:px-6 font-sans relative overflow-x-hidden"
    >
      {/* Dual-Tone Animated Mesh Background */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-400/30 rounded-full blur-[100px] md:blur-[140px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="fixed bottom-[-10%] left-[-10%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-indigo-500/20 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"
      />

      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 flex flex-col items-center mb-6 text-center w-full max-w-3xl"
      >
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 tracking-tight leading-none mb-1">
          HEAD COUNT TAKER
        </h1>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] opacity-80 mb-6 drop-shadow-sm">
          INDUSTRIAL VISIT - ECE S4
        </p>
        
        {/* Floating HUD Summary Bar */}
        <div className="w-full bg-white/30 backdrop-blur-2xl border-[0.5px] border-white/60 rounded-[28px] p-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
          
          <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Live Fleet Headcount</span>
          <div className="flex w-full justify-between px-1 md:px-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num, idx) => (
              <div key={num} className="flex flex-col items-center group">
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-1 group-hover:text-emerald-400 transition-colors">C{num}</span>
                <span className={`text-lg md:text-2xl font-black transition-all duration-500 ${columnTotals[idx] === students.length ? 'text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-600 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)] scale-110' : 'text-slate-600'}`}>
                  {columnTotals[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Deep Glass Container - Student List */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 w-full max-w-4xl bg-white/20 backdrop-blur-[40px] border-[0.5px] border-white/50 p-3 md:p-6 rounded-[32px] md:rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col items-center min-h-[400px]"
      >
        <div className="w-full space-y-3 md:space-y-4">
          {students.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.02 * idx }}
              className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 md:p-5 border-[0.5px] rounded-[24px] backdrop-blur-md transition-all duration-300 bg-white/30 border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:bg-white/40 hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
            >
              {/* Student Name */}
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/80 to-white/30 border border-white/60 flex items-center justify-center font-black text-slate-400 text-xs shadow-inner shrink-0">
                  {student.name.charAt(0)}
                </div>
                <span className="text-sm md:text-base font-black text-slate-800 tracking-tight">
                  {student.name}
                </span>
              </div>

              {/* Physical Glass Buttons */}
              <div className="flex justify-between md:justify-end md:gap-3 w-full md:w-auto">
                {student.counts.map((isChecked, countIndex) => (
                  <button
                    key={countIndex}
                    onClick={() => toggleCount(student.id, countIndex)}
                    className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[11px] md:text-xs font-black transition-all duration-300 border-[0.5px] active:scale-90 overflow-hidden ${
                      isChecked
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_15px_rgba(16,185,129,0.5)] md:scale-110'
                        : 'bg-white/40 text-slate-500 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_5px_rgba(0,0,0,0.02)] hover:bg-white/60'
                    }`}
                  >
                    {!isChecked && <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-full"></div>}
                    <span className="relative z-10">{countIndex + 1}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Premium Pill Back Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative z-20 mt-10 mb-8">
        <NextLink href="/admin" className="px-8 py-4 bg-white/30 backdrop-blur-2xl border-[0.5px] border-white/60 rounded-[30px] text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:bg-white/50 active:scale-95 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.05)] inline-flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Portal
        </NextLink>
      </motion.div>
    </div>
  )
}